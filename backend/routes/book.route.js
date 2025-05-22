import express from 'express'
import passport from 'passport'
import mongoose from 'mongoose'
import { validateBook } from '../validator/book.validator.js'
import Book from '../models/Book.module.js'
import rateLimit from 'express-rate-limit'
import sanitizeHtml from 'sanitize-html'
import Review from '../models/Review.module.js'
import { formatBookWithDiscount } from '../utils/discountHelper.js'
import { formatReview } from '../utils/formatReview.js'

import { expressjwt } from 'express-jwt'
import keys from '../config/keys.config.js'
import { genresList } from '../config/genresList.js'
import { errorHandler } from '../middleware/errorHandler.js'
import { validateBookQuery } from '../validator/bookQuery.validator.js'
import { sanitizeBook } from '../utils/sanitizeBook.js'

import { aesEncrypt } from '../helper/encryption.js'
import { aesDecrypt } from '../helper/decryption.js'

import forge from 'node-forge'
import crypto from 'crypto'
import AesBook from '../models/AesBook.module.js'

const router = express.Router()


const optionalAuth = expressjwt({
  secret: keys.secretOrKey,
  algorithms: ['HS256'],
  credentialsRequired: false, // 👈 this makes JWT optional
})
//@route  GET /api/book/search
//@desc   Search books by title, description, genre or author name
//@access Public
router.get('/search', async (req, res, next) => {
  const query = req.query.query || ''
  const page = Math.max(1, parseInt(req.query.page) || 1) // ✅ Always at least page 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const searchRegex = new RegExp(query, 'i')

  try {
    // Get matched books (with author lookup)
    const booksAggregation = await Book.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: '$authorDetails' },

      {
        $match: {
          $and: [
            { isPublished: true },
            { releaseDate: { $lte: new Date() } },
            {
              $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { genre: { $regex: searchRegex } },
                { 'authorDetails.name': { $regex: searchRegex } },
              ],
            },
          ],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          coverImage: 1,
          genre: 1,
          price: 1,
          averageRating: 1,
          reviews: 1,
          createdAt: 1,
          authorDetails: {
            _id: 1,
            name: 1,
            email: 1,
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ])

    // Get total matching books
    const totalAggregation = await Book.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorDetails',
        },
      },
      { $unwind: '$authorDetails' },
      {
        $match: {
          $and: [
            { isPublished: true },
            { releaseDate: { $lte: new Date() } },
            {
              $or: [
                { title: { $regex: searchRegex } },
                { description: { $regex: searchRegex } },
                { genre: { $regex: searchRegex } },
                { 'authorDetails.name': { $regex: searchRegex } },
              ],
            },
          ],
        },
      },
      { $count: 'total' },
    ])

    const total = totalAggregation.length > 0 ? totalAggregation[0].total : 0
    const totalPages = Math.ceil(total / limit)

    const books = booksAggregation.map((book) => {
      const { authorDetails, ...rest } = book
      const structuredBook = { ...rest, author: authorDetails }
      return sanitizeBook(
        formatBookWithDiscount(structuredBook),
        req.user || {}
      )
    })
    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages: totalPages,
    })
  } catch (error) {
    next(error)
  }
})

// Utility: role-based authorization middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user.role || []
    const isAuthorized = allowedRoles.some((role) => userRoles.includes(role))
    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied',
          details: {
            role: 'Forbidden: Insufficient permissions',
          },
        },
      })
    }
    next()
  }
}

// @route   PATCH /api/book/:bookId/publish
// @desc    Toggle publish/unpublish a book
// @access  Private (seller only)
router.patch(
  '/:bookId/publish',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { bookId } = req.params
      let { publish } = req.body // could be boolean, string, or missing

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({
          success: false,
          error: {
            details: {
              bookId: 'Invalid book id',
            },
          },
        })
      }

      const book = await Book.findById(bookId)
      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            details: {
              book: 'Book not found',
            },
          },
        })
      }

      // Check if the current user is the author of the book
      if (book.author.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: {
            details: {
              auth: 'Unauthorized: Not your book',
            },
          },
        })
      }

      // 🔒 Coerce string 'true'/'false' → boolean
      if (typeof publish === 'string') {
        publish = publish.toLowerCase() === 'true'
      }

      if (typeof publish !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: {
            details: {
              publish: 'Invalid "publish" value. Must be true or false.',
            },
          },
        })
      }

      book.isPublished = publish
      await book.save()

      res.status(200).json({
        success: true,
        message: `Book has been ${publish ? 'published' : 'unpublished'
          } successfully.`,
        book,
      })
    } catch (error) {
      next(error)
    }
  }
)

//@route  PATCH /api/book/:id/discount
//@desc   Set or update discount details for a book
//@access Private (only seller who owns it)
router.patch(
  '/:id/discount',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('seller'),
  async (req, res, next) => {
    const { id } = req.params
    const { discountPercentage, discountStart, discountEnd } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: {
          details: {
            id: 'Invalid book ID',
          },
        },
      })
    }

    if (
      typeof discountPercentage !== 'number' ||
      discountPercentage <= 0 ||
      discountPercentage > 100
    ) {
      return res.status(400).json({
        success: false,
        error: {
          details: {
            discountPercentage:
              'Invalid discount percentage (must be between 1 and 100)',
          },
        },
      })
    }

    if (!discountStart || !discountEnd) {
      return res.status(400).json({
        success: false,
        message: 'Both discountStart and discountEnd must be provided',
      })
    }

    try {
      const book = await Book.findById(id)

      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            details: {
              book: 'Book not found',
            },
          },
        })
      }

      if (!book.author.equals(req.user.id)) {
        return res.status(403).json({
          success: false,
          error: {
            details: {
              auth: 'Unauthorized to set discount for this book',
            },
          },
        })
      }

      const now = new Date()

      // 🚫 Block if there’s an active or future discount
      if (
        book.discountPercentage > 0 &&
        book.discountEnd &&
        new Date(book.discountEnd) > now
      ) {
        return res.status(400).json({
          success: false,
          error: {
            details: {
              discountPercentage: `This book is already discounted until ${new Date(
                book.discountEnd
              ).toLocaleString()}. You can only apply a new discount after that.`,
            },
          },
        })
      }
      // 🔥 Actually updating the discount fields
      book.discountPercentage = discountPercentage
      book.discountStart = new Date(discountStart)
      book.discountEnd = new Date(discountEnd)

      await book.save()

      // ✅ Re-fetch the updated book and format it
      const updatedBook = await Book.findById(book._id).populate(
        'author',
        'name'
      )
      const formattedBook = formatBookWithDiscount(updatedBook)

      return res.status(200).json({
        success: true,
        message: 'Discount set successfully',
        book: formattedBook,
      })
    } catch (error) {
      next(error)
    }
  }
)

// @route   PATCH /api/book/:bookId/remove-discount
// @desc    Remove discount from a book
// @access  Private (Only the book's seller)
router.patch(
  '/:bookId/remove-discount',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('seller'),
  async (req, res) => {
    const { bookId } = req.params
    const userId = req.user.id

    try {
      const book = await Book.findById(bookId)

      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
          },
        })
      }

      if (!book.author.equals(userId)) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Unauthorized to modify this book',
          },
        })
      }

      // Reset discount fields
      book.discountPercentage = 0
      book.discountStart = null
      book.discountEnd = null

      await book.save()

      res.status(200).json({
        success: true,
        message: 'Discount removed successfully',
        book,
      })
    } catch (error) {
      console.error('Error removing discount:', error)
      res.status(500).json({
        success: false,
        error: {
          message: 'Server error',
          details: { server: error.message || 'Internal error' },
        },
      })
    }
  }
)


// @route   GET /api/book/genres
// @desc    Get all genres 
router.get('/genres', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Genres retrieved successfully',
    genres: genresList,
  })
})

// @route   GET /api/book/genre/:slug
// @desc    Get specific genres
router.get('/genre/:slug', async (req, res, next) => {
  const genreSlug = req.params.slug.toLowerCase()
  const genreObj = genresList.find((g) => g.slug === genreSlug)

  if (!genreObj) {
    return res.status(404).json({ success: false, message: 'Genre not found' })
  }

  const genreName = genreObj.name
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  try {
    const books = await Book.find({
      genres: genreName,
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .populate('author', 'name ')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      genres: genreName,
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })

    res.status(200).json({
      success: true,
      message: `Books retrieved for genre '${genreName}'`,
      genre: genreObj,
      books: books.map((book) =>
        sanitizeBook(formatBookWithDiscount(book), req.user || {})
      ),
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    next(error)
  }
})

// @route   GET /api/book/discounted
// @desc    Get currently discounted books
// @access  Public
router.get('/discounted', async (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  const now = new Date()

  try {
    // 1) fetch only books with an active discount
    const raw = await Book.find({
      discountPercentage: { $gt: 0 },
      discountStart: { $lte: now },
      discountEnd: { $gte: now },
      isPublished: true,
      releaseDate: { $lte: now },
    })
      .populate('author', 'name ')
      .skip(skip)
      .limit(limit)
      .sort({ discountPercentage: -1 })

    const books = raw.map((book) =>
      sanitizeBook(formatBookWithDiscount(book), req.user || {})
    )
    // 3) count total for pagination
    const total = await Book.countDocuments({
      discountPercentage: { $gt: 0 },
      discountStart: { $lte: now },
      discountEnd: { $gte: now },
    })
    const totalPages = Math.ceil(total / limit)

    return res.json({
      success: true,
      message: 'Discounted books retrieved successfully',
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages,
    })
  } catch (err) {
    next(err)
  }
})

// @route   GET /api/book/myBooks
// @desc    Get books uploaded by the logged-in seller, with optional search
// @access  Private
router.get(
  '/myBooks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.max(1, parseInt(req.query.limit) || 10)
    const skip = (page - 1) * limit
    const query = req.query.query || ''
    const searchRegex = new RegExp(query, 'i')

    try {
      const books = await Book.find({
        author: req.user.id,
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { genre: { $regex: searchRegex } },
        ],
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')

      const total = await Book.countDocuments({
        author: req.user.id,
        $or: [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { genre: { $regex: searchRegex } },
        ],
      })

      const totalPages = Math.ceil(total / limit)

      const booksWithDecryptedLinks = await Promise.all(
        books.map(async (book) => {
          const keyEntry = await AesBook.findOne({ bookId: book._id })
          if (keyEntry) {
            const aesKey = Buffer.from(keyEntry.aesKey, 'base64')
            book.file.filePath = aesDecrypt(aesKey, book.file.filePath)
          }

          return sanitizeBook(formatBookWithDiscount(book), req.user)
        })
      )

      res.status(200).json({
        success: true,
        message: 'Your books retrieved successfully',
        books: booksWithDecryptedLinks,
        currentPage: page,
        pageSize: limit,
        totalBooks: total,
        totalPages,
      })
    } catch (error) {
      console.error('Error fetching seller books:', error)
      return res.status(500).json({
        success: false,
        error: {
          message: 'Server error',
          details: {
            server: error.message || 'Internal server error',
          },
        },
      })
    }
  }
)


// router.get(
//   '/book-count'
//   passport.authenticate('jwt', { session: false }),
//   async (req, res, next) => {

//   }
// )

//@route  GET /api/book/my-discounted
//@desc   Get discounted books uploaded by the logged-in seller
//@access Private
router.get(
  '/my-discounted',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const query = req.query.query || ''
    const searchRegex = new RegExp(query, 'i')
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const now = new Date()

    const filter = {
      author: req.user.id,
      isPublished: true,
      releaseDate: { $lte: now },
      discountPercentage: { $gt: 0 },
      discountStart: { $lte: now },
      discountEnd: { $gte: now },
      $and: [
        {
          $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { genre: { $regex: searchRegex } },
            { publisher: { $regex: searchRegex } },
          ],
        },
      ],
    }

    try {
      const raw = await Book.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ discountPercentage: -1 })
        .populate('author', 'name ')

      const books = raw.map(formatBookWithDiscount)

      const total = await Book.countDocuments(filter)
      const totalPages = Math.ceil(total / limit)

      res.status(200).json({
        success: true,
        message: 'Your discounted books retrieved successfully',
        books,
        currentPage: page,
        pageSize: limit,
        totalBooks: total,
        totalPages,
      })
    } catch (error) {
      next(error)
    }
  }
)

//@route  GET /api/book/new
//@desc   Get newly added books (sorted by createdAt)
//@access Public
router.get('/new', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  try {
    const rawBooks = await Book.find({
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(limit)
      .populate({ path: 'author', select: 'name ' }) // Include author details

    const total = await Book.countDocuments({
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })

    const books = rawBooks.map((book) =>
      sanitizeBook(formatBookWithDiscount(book), req.user || {})
    )
    res.status(200).json({
      success: true,
      message: 'Newly added books retrieved',
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
    })
  } catch (error) {
    console.error('Error fetching newest books:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Server error',
        details: {
          server: error.message || 'Internal server error',
        },
      },
    })
  }
})

//@route  GET /api/book/free
//@desc   Get free books (price = 0)
//@access Public
router.get('/free', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find({ price: 0, isPublished: true })
      .populate('author', 'name ')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({ price: 0, isPublished: true })
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      success: true,
      message: 'Free books retrieved successfully',
      total,
      books: books.map((book) => sanitizeBook(book, req.user || {})),
      currentPage: page,
      pageSize: limit,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
})

//@route  GET /api/book/top-rated
//@desc   Get top-rated books
//@access Public
router.get('/top-rated', async (req, res, next) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit
  try {
    const rawBooks = await Book.find({
      isPublished: true,
      releaseDate: { $lte: new Date() },
      averageRating: { $gt: 0 }, // Only books with ratings
    })

      .sort({ averageRating: -1, createdAt: -1 }) // Highest rated first
      .skip(skip)
      .limit(limit)
      .populate({ path: 'author', select: 'name ' })

    const total = await Book.countDocuments({
      isPublished: true,
      releaseDate: { $lte: new Date() },
      averageRating: { $gt: 0 },
    })

    const books = rawBooks.map((book) =>
      sanitizeBook(formatBookWithDiscount(book), req.user || {})
    )
    res.status(200).json({
      success: true,
      message: 'Top rated books retrieved',
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total,
    })
  } catch (error) {
    console.error('Error fetching top-rated books:', error)
    return res.status(500).json({
      success: false,
      error: {
        message: 'Server error',
        details: {
          server: error.message || 'Internal server error',
        },
      },
    })
  }
})

//@route  GET /api/book
//@desc   Get all books with pagination
router.get('/', async (req, res, next) => {
  const validation = validateBookQuery(req.query)

  if (!validation.success) {
    return res.status(400).json(validation)
  }

  const { page, limit } = validation.value

  try {
    const rawBooks = await Book.find({
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .populate('author', 'name ')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({ isPublished: true })
    const totalPages = Math.ceil(total / limit)

    const books = rawBooks.map(formatBookWithDiscount)

    res.status(200).json({
      success: true,
      message: 'Books retrieved successfully',
      books: books.map((book) => sanitizeBook(book, req.user || {})),
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages,
    })
  } catch (error) {
    next(error)
  }
})
router.get('/summary/:authorId', async (req, res, next) => {
  const { authorId } = req.params

  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({
      success: false,
      error: { authorId: 'Invalid author ID' },
    })
  }

  try {
    const books = await Book.find({
      author: authorId,
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .populate('author', 'name')
      .select('title author')

    const totalBooks = books.length

    const summary = books.map((book) => ({
      title: book.title,
      author: book.author?.name || 'Unknown',
    }))

    res.status(200).json({
      success: true,
      totalBooks,
      books: summary,
    })
  } catch (error) {
    next(error)
  }
})


//TODO: implement encryption for OT upload
//@route  POST /api/book
//@desc   Create a new book
//@access Private (Only sellers)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('seller'),
  async (req, res, next) => {
    const validation = validateBook(req.body)
    if (!validation.success) {
      return res.status(400).json(validation)
    }

    try {
      const {
        title,
        price,
        genre,
        description,
        coverImage,
        filePath,
        publisher,
        isbn,
        releaseDate,
      } = req.body

      // encrypting link before publishing
      const aesKey = crypto.randomBytes(32)
      const encryptedLink = aesEncrypt(aesKey, filePath)

      const now = new Date()


      const book = new Book({
        title,
        author: req.user.id,
        price,
        genre,
        description,
        coverImage,
        publisher,
        isbn,
        releaseDate,
        file: { filePath: encryptedLink },
        isPublished: releaseDate && new Date(releaseDate) <= now,
      })

      await book.save()
      await book.populate('author', 'name')

      //TODO: find a way to securely save the AES key
      // Temporary solution for saving encrypted key
      const aesBook = new AesBook({
        bookId: book._id,
        aesKey: aesKey.toString('base64')
      })

      await aesBook.save()
      res
        .status(201)
        .json({ success: true, message: 'Book uploaded successfully', book })
    } catch (error) {
      next(error)
    }
  }
)

//@route  PUT /api/book/:bookId
//@desc   Update book details
//@access Private
router.put(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const validation = validateBook(req.body)
    if (!validation.success) {
      return res.status(400).json(validation)
    }

    const { bookId } = req.params

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: { bookId: 'Invalid book ID' },
        },
      })
    }

    const {
      title,
      price,
      genre,
      description,
      coverImage,
      filePath,
      publisher,
      isbn,
      releaseDate,
    } = req.body
    const userId = req.user.id

    try {
      const book = await Book.findById(bookId)
      if (!book) {
        return res
          .status(404)
          .json({ success: false, message: 'Book not found' })
      }
      if (!book.author.equals(userId)) {
        return res
          .status(403)
          .json({ success: false, message: 'Unauthorized to update this book' })
      }

      // finding saved AES key for the book
      const aesBook = await AesBook.findOne({ bookId })
      if (!aesBook) return res.status(404).json({ success: false, message: 'Not a valid Book!' })

      const aesKey = Buffer.from(aesBook.aesKey, 'base64')

      try {
        const currentDecryptedLink = aesDecrypt(aesKey, book.file.filePath)
        if (filePath && filePath !== currentDecryptedLink) {
          book.file.filePath = aesEncrypt(aesKey, filePath)
        }

      } catch (err) {
        console.error('Decryption failed:', err.message)
        return res.status(400).json({
          success: false,
          message: 'Decryption failed — possibly due to corrupted or mismatched link',
        })
      }

      book.title = title
      book.price = price
      book.genre = genre
      book.description = description
      book.coverImage = coverImage
      book.publisher = publisher
      book.isbn = isbn
      book.releaseDate = releaseDate


      await book.save()
      res.json({ success: true, message: 'Book updated successfully', book })
    } catch (error) {
      next(error)
    }
  }
)
//get /api/book/:id
//desc Get one single book
//@access Public
router.get('/:id', optionalAuth, async (req, res, next) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: {
          id: 'Invalid book ID',
        },
      },
    })
  }

  try {
    const book = await Book.findById(id).populate('author', 'name')

    if (!book) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Book not found',
          details: {
            id: 'No book found with this ID',
          },
        },
      })
    }

    const now = new Date()
    const isReleased = book.releaseDate && book.releaseDate <= now
    const isPublic = book.isPublished && isReleased

    const user = req.user || {}
    const isOwner = book.author && book.author._id?.toString() === user.id

    if (!isPublic && !isOwner) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Access denied',
          details: {
            access: 'Book not released yet or you are not the owner',
          },
        },
      })
    }

    const bookObj = sanitizeBook(book, req.user || {})

    const recentReviews = await Review.find({ bookId: id })
      .sort({ createdAt: -1 })
      .limit(3)

    const totalReviews = await Review.countDocuments({ bookId: id })

    const avgRatingAgg = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: '$bookId', avgRating: { $avg: '$rating' } } },
    ])
    const averageRating = avgRatingAgg[0]?.avgRating?.toFixed(2) || '0.00'

    bookObj.reviews = recentReviews.map(formatReview)
    bookObj.totalReviews = totalReviews
    bookObj.averageRating = averageRating


    bookObj.releaseDateFormatted = book.releaseDate
      ? new Date(book.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : null

    return res.status(200).json({
      success: true,
      message: 'Book retrieved successfully',
      book: bookObj,
    })
  } catch (error) {
    next(error)
  }
})

//@route  DELETE /api/book/:bookId
//@desc   Delete a book
//@access Private
router.delete(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const { bookId } = req.params
    const userId = req.user.id
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: { bookId: 'Invalid book ID' },
        },
      })
    }

    try {
      const book = await Book.findById(bookId)

      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Book not found',
            details: { bookId: 'No book found with this ID' },
          },
        })
      }

      if (!book.author.equals(userId)) {
        return res.status(403).json({
          success: false,
          error: {
            message: 'Unauthorized',
            details: { user: 'You do not have permission to delete this book' },
          },
        })
      }

      await Book.findByIdAndDelete(bookId)
      await AesBook.deleteOne({ bookId: req.params.bookId })
      res.json({ success: true, message: 'Book deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
)

// Limit: 1 review per 3 minute per IP
const reviewLimiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 5,
  success: false,
  message: 'Too many reviews from this IP. Please try again shortly.',
})


//POST /api/book/:id/review
router.post('/:id/review', reviewLimiter, async (req, res, next) => {
  const { id } = req.params
  const { comment, rating } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: { id: 'Invalid book ID' },
      },
    })
  }

 const sanitizedComment =
   typeof comment === 'string' ? sanitizeHtml(comment.trim()) : ''

  const numericRating = Number(rating)

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: { rating: 'Rating must be between 1 and 5' },
      },
    })
  }

  try {
    const bookExists = await Book.exists({ _id: id })

    if (!bookExists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Book not found',
          details: { id: 'No book found with this ID' },
        },
      })
    }

    const review = new Review({
      bookId: id,
      comment: sanitizedComment,
      rating: numericRating,
      name: 'Anonymous',
    })

    await review.save()

    // Calculate new average rating
    const agg = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$bookId',
          avgRating: { $avg: '$rating' },
        },
      },
    ])

    const averageRating = agg.length > 0 ? agg[0].avgRating.toFixed(2) : '0.00'

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      averageRating,
      review: formatReview(review),
    })
  } catch (error) {
    next(error)
  }
})


//get /api/book/:id/reviews
//desc get reviews
router.get('/:id/reviews', async (req, res, next) => {
  const { id } = req.params
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 5
  const skip = (page - 1) * limit

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: { id: 'Invalid book ID' },
      },
    })
  }

  try {
    const bookExists = await Book.exists({ _id: id })

    if (!bookExists) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Book not found',
          details: { id: 'No book found with this ID' },
        },
      })
    }

    const reviews = await Review.find({ bookId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalReviews = await Review.countDocuments({ bookId: id })

    const averageRatingAgg = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: '$bookId',
          avgRating: { $avg: '$rating' },
        },
      },
    ])

    const averageRating =
      averageRatingAgg.length > 0
        ? averageRatingAgg[0].avgRating.toFixed(2)
        : '0.00'

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved successfully',
      reviews: reviews.map(formatReview),
      averageRating,
      currentPage: page,
      pageSize: limit,
      totalReviews,
      totalPages: Math.ceil(totalReviews / limit),
    })
  } catch (error) {
    next(error)
  }
})


//@end-point: post /api/book/purchase
// end point for purchasing book
// Implementation of OT while making transaction.
router.post(
  '/purchase',

  passport.authenticate('jwt', { session: false }),

  async (req, res) => {
    const {
      authorId,
      publicKeys
    } = req.body

    if (!Array.isArray(publicKeys)) {
      return res.status(400).json({ error: 'Invalid input format!' })
    }

    if (!authorId) {
      return res.status(400).json({ error: 'Author id missing!' })
    }

    try {
      const books = await Book.find({ author: authorId }).sort({ createdAt: -1 })
      const aesKeys = await AesBook.find({ bookId: { $in: books.map(b => b._id) } })

      if (publicKeys.length !== books.length || aesKeys.length !== books.length) {
        return res.status(400).json({ error: 'Mismatch in book count and keys' })
      }

      //encrypted aes keys: buyer's public used 
      const rsaEncryptedKeys = []

      // aes keys for published book: in encrypted mode
      const aesCiphertexts = []

      // encrypting aes keys using buyers public key
      for (let i = 0; i < books.length; i++) {
        const pubKey = forge.pki.publicKeyFromPem(publicKeys[i])
        const aesKey = Buffer.from(aesKeys.find(k => k.bookId.equals(books[i]._id)).aesKey, 'base64')
        const encryptedAES = pubKey.encrypt(aesKey.toString(post, 'binary'), 'RSA-OAEP')
        rsaEncryptedKeys.push(Buffer.from(encryptedAES, 'binary').toString('base64'))
        aesCiphertexts.push(books[i].file.filePath)
      }


      res.status(201).json({
        rsaEncryptedKeys,
        aesCiphertexts,
        success: true,
        message: 'Book purchase simulated successfully!',
      })
    } catch (error) {
      console.error('unexpected error occured while purhcase:', error)
      next(error)
    }
  }

)

export default router
