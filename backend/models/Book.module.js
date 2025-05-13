// book.module.js
import mongoose from 'mongoose'
const { Schema } = mongoose

// Sub-schema for anonymous reviews
const reviewSchema = new Schema(
  {
    name: { type: String, default: 'Anonymous' },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users', // References the users (Seller) model
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String, // Store URL or path to the cover image (S3 URL possible)
      default:
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80',
    },
    publisher: {
      type: String, // Optional publisher field
    },
    isbn: {
      type: String, // Optional ISBN field
      unique: true,
    },
    releaseDate: {
      type: Date, // Optional release date field
    },
    file: {
      filePath: { type: String, required: true }, // Store AWS S3 URL
      //format: { type: String, enum: ["PDF", "EPUB"], required: true }, // File format
      // encryptionKey: { type: String, required: true }, // Optional encryption key
    },

    discountPercentage: { type: Number, default: 0 },
    discountStart: { type: Date, default: null },
    discountEnd: { type: Date, default: null },
    isPublished: {
      type: Boolean,
      default: false, // default is unpublished
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

// Calculate average rating based on all reviews
BookSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0
    return
  }
  const total = this.reviews.reduce((sum, r) => sum + (r.rating || 0), 0)
  this.averageRating = total / this.reviews.length
}

const Book = mongoose.model('books', BookSchema)

export default Book
