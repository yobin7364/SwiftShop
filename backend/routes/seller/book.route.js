import express from 'express'
const router = express.Router()
import passport from 'passport'
import mongoose from 'mongoose'
import { validateBook } from '../../validator/book.validator.js'
import Book from '../../models/Book.module.js'
import rateLimit from 'express-rate-limit'
import sanitizeHtml from 'sanitize-html'
import { categoriesWithGenres } from '../../config/categoriesGenres.js'
import { formatBookWithDiscount } from '../../utils/discountHelper.js'
import { expressjwt } from 'express-jwt'
import keys from '../../config/keys.config.js'
import { genresList } from '../../config/genresList.js'

const optionalAuth = expressjwt({
  secret: keys.secretOrKey,
  algorithms: ['HS256'],
  credentialsRequired: false, // 👈 this makes JWT optional
})
//@route  GET /api/book/search
//@desc   Search books by title, description, category, or author name
//@access Public
router.get('/search', async (req, res) => {
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
                { category: { $regex: searchRegex } },
                { genres: { $regex: searchRegex } },
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
          category: 1,
          genres: 1,
          price: 1,
          averageRating: 1,
          reviews: 1,
          file: 1,
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
                { category: { $regex: searchRegex } },
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

    res.status(200).json({
      message: 'Books retrieved successfully',
      books: booksAggregation, // Your paginated books
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages: totalPages,
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Utility: role-based authorization middleware
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const userRoles = req.user.role || []
    const isAuthorized = allowedRoles.some((role) => userRoles.includes(role))

    if (!isAuthorized) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' })
    }
    next()
  }
}

//@route  GET /api/book/test
//@desc   Tests post route
//@access Public
router.get('/test', (req, res) => res.json({ msg: 'Book Works' }))

//@route  GET /api/book/search
//@desc   Get books with search query
//@access Public
router.get('/search', async (req, res) => {
  const query = req.query.query || ''
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  const searchFilter = getSearchFilter(query)

  try {
    const books = await Book.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'name email' })

    const total = await Book.countDocuments(searchFilter)

    res
      .status(200)
      .json({ message: 'Books retrieved successfully', books, total })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
// @route   PATCH /api/book/:bookId/publish
// @desc    Toggle publish/unpublish a book
// @access  Private (seller only)
router.patch(
  '/:bookId/publish',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const { bookId } = req.params
      let { publish } = req.body // could be boolean, string, or missing

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ message: 'Invalid book ID.' })
      }

      const book = await Book.findById(bookId)
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' })
      }

      // Check if the current user is the author of the book
      if (book.author.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized: Not your book.' })
      }

      // 🔒 Coerce string 'true'/'false' → boolean
      if (typeof publish === 'string') {
        publish = publish.toLowerCase() === 'true'
      }

      if (typeof publish !== 'boolean') {
        return res
          .status(400)
          .json({ message: 'Invalid "publish" value. Must be true or false.' })
      }

      book.isPublished = publish
      await book.save()

      res.status(200).json({
        message: `Book has been ${
          publish ? 'published' : 'unpublished'
        } successfully.`,
        book,
      })
    } catch (error) {
      console.error('Error publishing/unpublishing book:', error)
      res.status(500).json({ message: 'Server error', error: error.message })
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
  async (req, res) => {
    const { id } = req.params
    const { discountPercentage, discountStart, discountEnd } = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid book ID' })
    }

    if (
      typeof discountPercentage !== 'number' ||
      discountPercentage <= 0 ||
      discountPercentage > 100
    ) {
      return res.status(400).json({
        message: 'Invalid discount percentage (must be between 1 and 100)',
      })
    }

    if (!discountStart || !discountEnd) {
      return res.status(400).json({
        message: 'Both discountStart and discountEnd must be provided',
      })
    }

    try {
      const book = await Book.findById(id)

      if (!book) {
        return res.status(404).json({ message: 'Book not found' })
      }

      if (!book.author.equals(req.user.id)) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to set discount for this book' })
      }

      // 🔥 Actually updating the discount fields
      book.discountPercentage = discountPercentage
      book.discountStart = new Date(discountStart)
      book.discountEnd = new Date(discountEnd)

      await book.save()

      // ✅ Re-fetch the updated book and format it
      const updatedBook = await Book.findById(book._id).populate(
        'author',
        'name email'
      )
      const formattedBook = formatBookWithDiscount(updatedBook)

      return res.status(200).json({
        message: 'Discount set successfully',
        book: formattedBook,
      })
    } catch (error) {
      console.error('Error setting discount:', error)
      return res
        .status(500)
        .json({ message: 'Server error', error: error.message })
    }
  }
)
router.get('/genres', (req, res) => {
  res.status(200).json({
    message: 'Genres retrieved successfully',
    genres: genresList,
  })
})

router.get('/genre/:slug', async (req, res) => {
  const genreSlug = req.params.slug.toLowerCase()
  const genreObj = genresList.find((g) => g.slug === genreSlug)

  if (!genreObj) {
    return res.status(404).json({ message: 'Genre not found' })
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
      .populate('author', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      genres: genreName,
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })

    res.status(200).json({
      message: `Books retrieved for genre '${genreName}'`,
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching books by genre:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// @route   GET /api/book/discounted
// @desc    Get currently discounted books
// @access  Public
router.get('/discounted', async (req, res) => {
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
      .populate('author', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const books = raw.map(formatBookWithDiscount)

    // 3) count total for pagination
    const total = await Book.countDocuments({
      discountPercentage: { $gt: 0 },
      discountStart: { $lte: now },
      discountEnd: { $gte: now },
    })
    const totalPages = Math.ceil(total / limit)

    return res.json({
      message: 'Discounted books retrieved successfully',
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages,
    })
  } catch (err) {
    console.error('Error fetching discounted books:', err)
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
})
//@route  GET /api/book/myBooks
//@desc   Get books uploaded by the logged-in user
//@access Private
router.get(
  '/myBooks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1) // Always at least page 1
    const limit = Math.max(1, parseInt(req.query.limit) || 10) // Default 10 books per page
    const skip = (page - 1) * limit

    try {
      const books = await Book.find({ author: req.user.id })
        .populate('author', 'name email')
        .sort({ isPublished: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const totalBooks = await Book.countDocuments({
        author: req.user.id,
      })

      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found for this user' })
      }
      const booksDetails = books.map((book) => ({
        _id: book._id,
        title: book.title,
        price: book.price,
        category: book.category,
        genres: book.genres,
        description: book.description,
        publisher: book.publisher,
        isbn: book.isbn,
        releaseDate: book.releaseDate,
        file: book.file,
        isPublished: book.isPublished,
        status: book.isPublished ? 'Published' : 'Unpublished',
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      }))
      const totalPages = Math.ceil(totalBooks / limit)

      res.status(200).json({
        message: 'Books retrieved successfully',
        books: booksDetails,
        currentPage: page,
        pageSize: limit,
        totalBooks,
        totalPages,
      })
    } catch (error) {
      console.error("Error fetching user's books:", error)
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  }
)

router.get('/categories-and-genres', (req, res) => {
  res.status(200).json({
    message: 'Category and genre options',
    data: categoriesWithGenres,
  })
})

//@route  GET /api/book/category/:category
//@desc   Get books by category
//@access Public
router.get('/category/:category', async (req, res) => {
  const category = req.params.category
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    })

    res
      .status(200)
      .json({ message: 'Books retrieved by categories', books, total })
  } catch (error) {
    console.error('Error fetching books by categories:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/new
//@desc   Get newly added books (sorted by createdAt)
//@access Public
router.get('/new', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find()
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .populate('author', 'name email') // Include author details

    res.status(200).json({
      message: 'Newly added books retrieved',
      books,
    })
  } catch (error) {
    console.error('Error fetching newly added books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/free
//@desc   Get free books (price = 0)
//@access Public
router.get('/free', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find({ price: 0 })
      .populate('author', 'name email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({ price: 0 })

    res.status(200).json({
      message: 'Free books retrieved successfully',
      books,
      total,
    })
  } catch (error) {
    console.error('Error fetching free books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/top-rated
//@desc   Get top-rated books
//@access Public
router.get('/top-rated', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find()
      .populate('author', 'name email')
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(limit)
      .select('title averageRating category price coverImage')

    res.status(200).json({
      message: 'Top rated books retrieved',
      books,
    })
  } catch (error) {
    console.error('Error fetching top rated books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
//@route  GET /api/book/genre/:genre
//@desc   Get books by a specific genre
//@access Public
router.get('/genre/:genre', async (req, res) => {
  const genre = req.params.genre
  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit

  try {
    const books = await Book.find({
      genres: { $regex: new RegExp(`^${genre}$`, 'i') },
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .populate('author', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      genres: { $regex: new RegExp(`^${genre}$`, 'i') },
    })
    const totalPages = Math.ceil(total / limit)

    res.status(200).json({
      message: `Books retrieved successfully for genre '${genre}'`,
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching books by genre:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
router.get('/:id', optionalAuth, async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book.findById(id).populate('author', 'name email')
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    const now = new Date()
    const isReleased = book.releaseDate && book.releaseDate <= now
    const isPublic = book.isPublished && isReleased
    const isOwner = req.user && book.author._id.toString() === req.user.id

    if (!isPublic && !isOwner) {
      return res.status(403).json({ message: 'Book not released yet' })
    }

    const bookObj = book.toObject()
    bookObj.releaseDateFormatted = book.releaseDate
      ? new Date(book.releaseDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    return res.status(200).json({
      message: 'Book retrieved successfully',
      book: bookObj,
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book
//@desc   Get all books with pagination
//@access Public
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const rawBooks = await Book.find({
      isPublished: true,
      releaseDate: { $lte: new Date() },
    })
      .populate('author', 'name email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({ isPublished: true })
    const totalPages = Math.ceil(total / limit)

    const books = rawBooks.map(formatBookWithDiscount)

    res.status(200).json({
      message: 'Books retrieved successfully',
      books,
      currentPage: page,
      pageSize: limit,
      totalBooks: total,
      totalPages: totalPages,
    })
  } catch (error) {
    console.error('Error fetching books:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  POST /api/book
//@desc   Create a new book
//@access Private (Only sellers)
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizeRoles('seller'),
  async (req, res) => {
    const { errors, isValid } = validateBook(req.body)
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid fields', errors })
    }

    try {
      const {
        title,
        price,
        category,
        genres,
        description,
        filePath,
        publisher,
        isbn,
        releaseDate,
      } = req.body

      const book = new Book({
        title,
        author: req.user.id,
        price,
        category,
        genres,
        description,
        publisher,
        isbn,
        releaseDate,
        file: { filePath },
      })

      await book.save()
      res.status(201).json({ message: 'Book uploaded successfully', book })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

//@route  PUT /api/book/:bookId
//@desc   Update book details
//@access Private
router.put(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateBook(req.body)
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid Fields', errors })
    }

    const { bookId } = req.params

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' })
    }

    const {
      title,
      price,
      category,
      description,
      filePath,
      publisher,
      isbn,
      releaseDate,
    } = req.body
    const userId = req.user.id

    try {
      const book = await Book.findById(bookId)

      if (
        !book.isPublished ||
        (book.releaseDate && book.releaseDate > new Date())
      ) {
        return res.status(403).json({ message: 'Book not released yet' })
      }

      if (!book) {
        return res.status(404).json({ message: 'Book not found' })
      }

      if (!book.author.equals(userId)) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to update this book' })
      }

      book.title = title
      book.price = price
      book.category = category
      book.description = description
      book.publisher = publisher
      book.isbn = isbn
      book.releaseDate = releaseDate
      book.file.filePath = filePath

      await book.save()
      res.json({ message: 'Book updated successfully', book })
    } catch (error) {
      console.error('Error updating book', error)
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

router.get('/:id', optionalAuth, async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book.findById(id).populate('author', 'name email')

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    const now = new Date()
    const isReleased = book.releaseDate && book.releaseDate <= now
    const isPublic = book.isPublished && isReleased
    const isOwner =
      req.user && book.author && book.author._id?.toString() === req.user.id

    if (!isPublic && !isOwner) {
      return res.status(403).json({ message: 'Book not released yet' })
    }

    const bookObj = book.toObject()
    bookObj.releaseDateFormatted = book.releaseDate
      ? new Date(book.releaseDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    return res.status(200).json({
      message: 'Book retrieved successfully',
      book: bookObj,
    })
  } catch (error) {
    console.error('Error fetching book:', error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

//@route  DELETE /api/book/:bookId
//@desc   Delete a book
//@access Private
router.delete(
  '/:bookId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { bookId } = req.params
    const userId = req.user.id

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'Invalid book ID' })
    }

    try {
      const book = await Book.findById(bookId)

      if (!book) {
        return res.status(404).json({ message: 'Book not found' })
      }

      if (!book.author.equals(userId)) {
        return res
          .status(403)
          .json({ message: 'Unauthorized to delete this book' })
      }

      await Book.findByIdAndDelete(bookId)
      res.json({ message: 'Book deleted successfully' })
    } catch (error) {
      console.error('Error deleting book:', error)
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

// Limit: 1 review per minute per IP
const reviewLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1,
  message: 'Too many reviews from this IP. Please try again shortly.',
})

// @route   POST /api/book/:id/review
// @desc    Add an anonymous review to a book
// @access  Public
router.post('/:id/review', reviewLimiter, async (req, res) => {
  const bookId = req.params.id
  const { comment, rating } = req.body

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment is required' })
  }

  const sanitizedComment = sanitizeHtml(comment.trim())
  const numericRating = Number(rating)
  const validRating =
    !isNaN(numericRating) && numericRating >= 1 && numericRating <= 5

  try {
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Add anonymous review
    book.reviews.push({
      name: 'Anonymous',
      comment: sanitizedComment,
      rating: validRating ? numericRating : undefined,
    })

    // Update average rating
    book.calculateAverageRating()

    await book.save()

    res.status(201).json({
      message: 'Anonymous review added successfully',
      reviews: book.reviews,
      averageRating: book.averageRating.toFixed(2),
    })
  } catch (error) {
    console.error('Error adding anonymous review:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})
//@route  GET /api/book/:id/reviews
//@desc   Get all reviews + average rating for a book
//@access Public
router.get('/:id/reviews', async (req, res) => {
  const { id } = req.params

  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.max(1, parseInt(req.query.limit) || 5) // Default 5 reviews per page
  const skip = (page - 1) * limit

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book.findById(id)

    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }
    const sortedReviews = book.reviews.sort((a, b) => b.createdAt - a.createdAt)

    const paginatedReviews = sortedReviews.slice(skip, skip + limit)
    const formattedReviews = paginatedReviews.map((review) => ({
      name: review.name,
      comment: review.comment,
      rating: review.rating,
      createdAt: new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    }))

    const totalReviews = book.reviews.length
    const totalPages = Math.ceil(totalReviews / limit)

    return res.status(200).json({
      message: 'Reviews retrieved successfully',
      averageRating: book.averageRating,
      reviews: formattedReviews,
      currentPage: page,
      pageSize: limit,
      totalReviews,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return res
      .status(500)
      .json({ message: 'Server error', error: error.message })
  }
})

export default router
