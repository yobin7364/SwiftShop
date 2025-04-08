import express from 'express'
const router = express.Router()
import passport from 'passport'
import mongoose from 'mongoose'
import { validateBook } from '../../validator/book.validator.js'
import Book from '../../models/Book.module.js'
import rateLimit from 'express-rate-limit'
import sanitizeHtml from 'sanitize-html'

// Utility: reusable search filter builder
function getSearchFilter(query) {
  const searchRegex = new RegExp(query, 'i')
  return {
    $or: [
      { title: { $regex: searchRegex } },
      { description: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ],
  }
}

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

//@route  GET /api/book/myBooks
//@desc   Get books uploaded by the logged-in user
//@access Private
router.get(
  '/myBooks',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const query = req.query.query || ''
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const searchFilter = getSearchFilter(query)

    try {
      const books = await Book.find({ author: req.user.id, ...searchFilter })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })

      const total = await Book.countDocuments({
        author: req.user.id,
        ...searchFilter,
      })

      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found for this user' })
      }

      res
        .status(200)
        .json({ message: 'Books retrieved successfully', books, total })
    } catch (error) {
      console.error("Error fetching user's books:", error)
      res.status(500).json({ message: 'Server error', error: error.message })
    }
  }
)

//@route  GET /api/book/genres
//@desc   Get all unique genres (categories)
//@access Public
router.get('/genres', async (req, res) => {
  try {
    const genres = await Book.distinct('category')
    res.status(200).json({ message: 'Genres retrieved', genres })
  } catch (error) {
    console.error('Error fetching genres:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/genre/:category
//@desc   Get books by genre (category)
//@access Public
router.get('/genre/:category', async (req, res) => {
  const category = req.params.category
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments({
      category: { $regex: new RegExp(`^${category}$`, 'i') },
    })

    res.status(200).json({ message: 'Books retrieved by genre', books, total })
  } catch (error) {
    console.error('Error fetching books by genre:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book/:id
//@desc   Get a single book by ID
//@access Public
router.get('/:id', async (req, res) => {
  const bookId = req.params.id

  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(400).json({ message: 'Invalid book ID' })
  }

  try {
    const book = await Book.findById(bookId)
    if (!book) {
      return res.status(404).json({ message: 'Book not found' })
    }

    // Format releaseDate
    const bookObj = book.toObject()
    bookObj.releaseDateFormatted = book.releaseDate
      ? new Date(book.releaseDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null

    res
      .status(200)
      .json({ message: 'Book retrieved successfully', book: bookObj })
  } catch (error) {
    console.error('Error fetching book:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

//@route  GET /api/book
//@desc   Get all books with pagination
//@access Public
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10

  try {
    const books = await Book.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await Book.countDocuments()

    res
      .status(200)
      .json({ message: 'Books retrieved successfully', books, total })
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

export default router
