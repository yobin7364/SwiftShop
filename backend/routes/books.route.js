import express from 'express'
import passport from 'passport'
import Book from '../models/Book.model.js'
import { validateBookInput } from '../validator/book.validator.js'
import Merchant from '../models/Merchant.model.js'
const router = express.Router()

// GET /api/books - List all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('merchant', 'businessName')
    res.json(books)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/books/:id - Get details of a single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate(
      'merchant',
      'businessName'
    )
    if (!book) {
      res.status(404).json({ success: false, error: 'Book not found' })
    }
    res.status(200).json({ success: true, data: book })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/books - Create a new book for merchant only
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // Validate the incoming book data
    const { errors, isValid } = validateBookInput(req.body)
    if (!isValid) {
      return res.status(400).json({ success: false, errors })
    }

    try {
      // Find the merchant profile associated with the logged-in user
      const merchantProfile = await Merchant.findOne({ user: req.user.id })
      if (!merchantProfile) {
        return res.status(401).json({
          success: false,
          error:
            'Merchant profile not found. Please register as a merchant to use the merchant portal.',
        })
      }

      const { title, author, description, price, ebookUrl, coverImageUrl } =
        req.body
      // Create a new book using the merchant's unique _id from the Merchant model
      const newBook = new Book({
        title,
        author,
        description,
        price,
        ebookUrl,
        coverImageUrl,
        merchant: merchantProfile._id,
      })

      const savedBook = await newBook.save()
      res.json({ success: true, data: savedBook })
    } catch (err) {
      console.error(err)
      res.status(500).json({ success: false, error: 'Server error' })
    }
  }
)
// PUT /api/books/:id - Update a book (merchant only)
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    // Validate the incoming book data (if using your validator)
    const { errors, isValid } = validateBookInput(req.body)
    if (!isValid) {
      return res.status(400).json({ success: false, errors })
    }

    try {
      const book = await Book.findById(req.params.id)
      if (!book) {
        return res.status(404).json({ error: 'Book not found' })
      }

      // Retrieve the merchant profile for the authenticated user
      const merchantProfile = await Merchant.findOne({ user: req.user.id })
      if (!merchantProfile) {
        return res.status(401).json({
          success: false,
          error: 'Merchant profile not found. Please register as a merchant.',
        })
      }

      // Check if the book belongs to the merchant
      if (book.merchant.toString() !== merchantProfile._id.toString()) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Update allowed fields
      book.title = req.body.title || book.title
      book.author = req.body.author || book.author
      book.description = req.body.description || book.description
      book.price = req.body.price || book.price
      book.ebookUrl = req.body.ebookUrl || book.ebookUrl
      book.coverImageUrl = req.body.coverImageUrl || book.coverImageUrl

      const updatedBook = await book.save()
      res.json(updatedBook)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

// DELETE /api/books/:id - Delete a book (merchant only)
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const book = await Book.findById(req.params.id)
      if (!book) return res.status(404).json({ error: 'Book not found' })

      const merchantProfile = await Merchant.findOne({ user: req.user.id })
      if (!merchantProfile) {
        return res.status(401).json({
          error: 'Merchant profile not found. Please register as a merchant.',
        })
      }

      // Verify that the authenticated merchant owns the book
      if (book.merchant.toString() !== merchantProfile._id.toString()) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await book.deleteOne()
      res.json({ msg: 'Book removed' })
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Server error' })
    }
  }
)

export default router
