// models/Order.module.js

import mongoose from 'mongoose'
const { Schema } = mongoose

const orderSchema = new Schema(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: 'books',
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const Order = mongoose.model('orders', orderSchema)
export default Order
