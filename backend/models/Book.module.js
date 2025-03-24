import mongoose from "mongoose";
const { Schema } = mongoose;

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users", // References the users (Seller) model
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String, // Store URL or path to the cover image (S3 URL possible)
    },
    file: {
      filePath: { type: String, required: true }, // Store AWS S3 URL
      //format: { type: String, enum: ["PDF", "EPUB"], required: true }, // File format
      // encryptionKey: { type: String, required: true }, // Optional encryption key
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("books", BookSchema);

export default Book;
