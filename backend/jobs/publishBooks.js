import cron from 'node-cron'
import mongoose from 'mongoose'
import Book from '../models/Book.module.js'

// Runs every 5 minutes
cron.schedule('*/1 * * * *', async () => {
  try {
    const result = await Book.updateMany(
      {
        isPublished: false,
        releaseDate: { $lte: new Date() },
      },
      { $set: { isPublished: true } }
    )

    if (result.modifiedCount > 0) {
      console.log(` Published ${result.modifiedCount} new book(s)`)
    }
  } catch (err) {
    console.error('Error in cron job:', err)
  }
})
