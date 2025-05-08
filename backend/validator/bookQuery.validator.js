import Joi from 'joi'

export const validateBookQuery = (query) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
    query: Joi.string().allow('').optional(),
  })

  const { error, value } = schema.validate(query, { abortEarly: false })

  if (error) {
    const details = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message
      return acc
    }, {})

    return {
      success: false,
      error: {
        details,
      },
    }
  }

  return {
    success: true,
    value, // validated + defaulted
  }
}
