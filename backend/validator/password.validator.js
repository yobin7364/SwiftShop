// validator/changePassword.validator.js

import Joi from 'joi'

export const validateChangePasswordInput = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().min(6).required().messages({
      'string.empty': 'Current password is required.',
      'string.min': 'Current password must be at least 6 characters long.',
    }),
    newPassword: Joi.string().min(6).required().messages({
      'string.empty': 'New password is required.',
      'string.min': 'New password must be at least 6 characters long.',
    }),
    confirmNewPassword: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.only': 'New password and confirm password must match.',
        'any.required': 'Confirm new password is required.',
      }),
  })

  const { error } = schema.validate(data, { abortEarly: false }) // Capture all errors
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

  return { success: true }
}
