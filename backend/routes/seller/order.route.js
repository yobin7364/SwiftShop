// routes/order.route.js

import express from 'express'
import mongoose from 'mongoose'
import Order from '../../models/Order.module.js'
import Book from '../../models/Book.module.js'
import passport from 'passport'
const router = express.Router()

// @route   POST /api/order
// @desc    Simulate purchase: create a new order
// @access  Private (requires login)

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { bookId } = req.body

    if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        error: {
          details: {
            bookId: 'Invalid or missing book ID.',
          },
        },
      })
    }

    try {
      const book = await Book.findById(bookId)
      if (!book) {
        return res.status(404).json({
          success: false,
          error: {
            details: {
              seller: 'Book not found',
            },
          },
        })
      }

      if (!book.author) {
        return res.status(400).json({
          success: false,
          error: {
            details: {
              seller: 'Book does not have a valid seller',
            },
          },
        })
      }
      const newOrder = new Order({
        book: book._id,
        seller: new mongoose.Types.ObjectId(book.author),
        amount: book.price,
      })

      await newOrder.save()

      res.status(201).json({
        success: true,
        message: 'Book purchase simulated successfully!',
      })
    } catch (error) {
      console.error('Error creating order:', error)
      next(error)
    }
  }
)

export default router
