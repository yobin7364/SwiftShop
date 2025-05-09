// backend/middleware/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  if (err.details && typeof err.details === 'object') {
    return res.status(err.status || 400).json({
      success: false,
      error: {
        details: err.details,
      },
    })
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0]
    const value = err.keyValue[field]

    return res.status(400).json({
      success: false,
      error: {
        details: {
          [field]: `Duplicate value: '${value}' is already used.`,
        },
      },
    })
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.entries(err.errors).reduce((acc, [field, val]) => {
      acc[field] = val.message
      return acc
    }, {})

    return res.status(400).json({
      success: false,
      error: {
        details,
      },
    })
  }

  // Fallback for all other errors
  return res.status(err.status || 500).json({
    success: false,
    error: {
      details: {
        server:
          process.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : err.message,
      },
    },
  })
}
