// validator/edit.validator.js
import Joi from 'joi'

export const validateEditUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Name must be at least 2 characters.',
      'string.max': 'Name must not exceed 50 characters.',
    }),
    email: Joi.string().email().optional().messages({
      'string.email': 'Email must be a valid format.',
    }),
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
