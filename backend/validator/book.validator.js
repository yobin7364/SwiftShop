import Joi from 'joi'

export const validateBookInput = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required.',
    }),
    author: Joi.string().required().messages({
      'string.empty': 'Author is required.',
    }),
    description: Joi.string().allow('').optional(),
    price: Joi.number().required().messages({
      'number.base': 'Price must be a number.',
      'any.required': 'Price is required.',
    }),
    ebookUrl: Joi.string().uri().required().messages({
      'string.uri': 'Ebook URL must be a valid URL.',
      'any.required': 'Ebook URL is required.',
    }),
    coverImageUrl: Joi.string().uri().allow('').optional(),
  })

  const { error } = schema.validate(data, { abortEarly: false })
  const errors = error
    ? error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message
        return acc
      }, {})
    : {}

  return { errors, isValid: !error }
}
