import Joi from 'joi'

export const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required().messages({
      'string.empty': 'Title is required.',
    }),
    price: Joi.number().min(0).precision(2).required().messages({
      'number.base': 'Price must be a valid number.',
      'number.min': 'Price cannot be negative.',
      'any.required': 'Price is required.',
    }),
    genre: Joi.string().trim().required().messages({
      'string.empty': 'Genre is required.',
    }),
    description: Joi.string().trim().allow('').messages({
      'string.empty': 'Description cannot be empty.',
    }),
    coverImage: Joi.string().uri().required().messages({
      'string.uri': 'Cover image must be a valid URL.',
      'any.required': 'Cover image is required.',
    }),
    filePath: Joi.string().uri().required().messages({
      'string.uri': 'File path must be a valid URL.',
      'any.required': 'File path is required.',
    }),
    publisher: Joi.string().optional(),
    isbn: Joi.string()
      .pattern(/^(?:\d{9}[\dXx]|\d{13})$/)
      .allow('', null)
      .messages({
        'string.pattern.base':
          'ISBN must be a valid ISBN-10 or ISBN-13 number.',
      }),
    releaseDate: Joi.date().iso().required().messages({
      'date.base': 'Release date must be a valid ISO date.',
      'any.required': 'Release date is required.',
    }),
    isPublished: Joi.boolean(),
  })

  const { error } = schema.validate(data, { abortEarly: false })

  if (error) {
    const details = error.details.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message
      return acc
    }, {})

    return {
      success: false,
      error: {
        message: 'Validation failed',
        details,
      },
    }
  }

  return { success: true }
}
