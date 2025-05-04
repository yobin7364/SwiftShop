// backend/middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  console.error('❌ Server Error:', err)

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    const value = err.keyValue[field]

    return res.status(400).json({
      success: false,
      message: `Duplicate ${field} entered`,
      field,
      value,
    })
  }

  // Handle validation errors (optional)
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  // Fallback for all other server errors
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  })
}
