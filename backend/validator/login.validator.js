import Joi from 'joi'

export const validateLoginInput = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Invalid email format',
      'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    }),
    role: Joi.string().valid('buyer', 'seller').required().messages({
      'any.only': "Role must be either 'buyer' or 'seller'.",
      'any.required': 'Role is required.',
    }),
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
