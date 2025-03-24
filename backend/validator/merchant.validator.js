import Joi from 'joi'

export const validateMerchantInput = (data) => {
  const schema = Joi.object({
    businessName: Joi.string().required().messages({
      'string.empty': 'Business Name is required.',
    }),
    businessDescription: Joi.string().allow('').optional(),
    contactEmail: Joi.string().email().optional().messages({
      'string.email': 'Contact Email must be a valid email.',
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
