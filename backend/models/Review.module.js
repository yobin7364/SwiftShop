import mongoose from 'mongoose'
const { Schema } = mongoose

const reviewSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  name: {
    type: String,
    required: true,
    default: 'Anonymous',
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})
const Review = mongoose.model('Review', reviewSchema)
export default Review