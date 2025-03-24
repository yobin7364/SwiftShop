import mongoose from 'mongoose'
const { Schema } = mongoose

const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    ebookUrl: { type: String, required: true },
    coverImageUrl: { type: String },
    // Reference to the merchant who added the book
    merchant: { type: Schema.Types.ObjectId, ref: 'Merchant', required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
)

const Book = mongoose.model('books', BookSchema)
export default Book
