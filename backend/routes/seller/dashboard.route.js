// routes/dashboard.route.js

import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import Order from '../../models/Order.module.js'
import Book from '../../models/Book.module.js'

const router = express.Router()

// @route   GET /api/seller/dashboard
// @desc    Get seller's dashboard summary: total sales, revenue, top books, recent reviews
// @access  Private (seller only)
router.get(
  '/dashboard',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const sellerId = req.user.id

      // 1. Total Books
      const totalBooks = await Book.countDocuments({ author: sellerId })

      // 2. All orders for this seller
      const orders = await Order.find({
        seller: new mongoose.Types.ObjectId(sellerId),
      })

      const totalSales = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0)

      // 3. Sales and Revenue Overview (Monthly)
      const monthlySales = {}
      const monthlyRevenue = {}

      orders.forEach((order) => {
        const month = new Date(order.createdAt).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        })
        monthlySales[month] = (monthlySales[month] || 0) + 1
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount
      })

      // Sort Months Jan-Dec
      const monthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]

      const monthYearKeys = Object.keys(monthlySales).sort((a, b) => {
        const toDate = (str) => new Date(`1 ${str}`) // "Apr 2025" → 1 Apr 2025
        return toDate(a) - toDate(b)
      })

      const sortedSalesOverview = monthYearKeys.map((key) => ({
        month: key,
        value: monthlySales[key],
      }))

      const sortedRevenueOverview = monthYearKeys.map((key) => ({
        month: key,
        value: monthlyRevenue[key],
      }))

      // 4. Average Rating
      const books = await Book.find({ author: sellerId }).select(
        'averageRating reviews title'
      )

      const avgRating =
        books.length > 0
          ? (
              books.reduce((sum, book) => sum + (book.averageRating || 0), 0) /
              books.length
            ).toFixed(2)
          : '0.00'

      // 5. Top Selling Books
      const bookSalesCount = {}
      orders.forEach((order) => {
        const bookId = order.book.toString()
        bookSalesCount[bookId] = (bookSalesCount[bookId] || 0) + 1
      })

      const sortedBookEntries = Object.entries(bookSalesCount).sort(
        (a, b) => b[1] - a[1]
      )
      const top5BookIds = sortedBookEntries
        .slice(0, 5)
        .map(([bookId]) => bookId)

      const topBooks = await Book.find({ _id: { $in: top5BookIds } }).select(
        'title averageRating'
      )

      const topSellingBooks = topBooks.map((book) => ({
        title: book.title,
        sales: bookSalesCount[book._id.toString()] || 0,
        rating: book.averageRating ? book.averageRating.toFixed(2) : '0.0',
      }))

      // 6. Recent Reviews across all seller's books
      const allReviews = []

      books.forEach((book) => {
        book.reviews?.forEach((review) => {
          allReviews.push({
            bookTitle: book.title,
            text: review.comment,
            rating: review.rating,
            createdAt: review.createdAt,
          })
        })
      })

      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const recentReviews = allReviews.slice(0, 5)

      // 7. Send full dashboard
      res.status(200).json({
        totalBooks,
        totalSales,
        totalRevenue,
        avgRating,
        salesOverview: sortedSalesOverview,
        revenueOverview: sortedRevenueOverview,
        topSellingBooks,
        recentReviews,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
