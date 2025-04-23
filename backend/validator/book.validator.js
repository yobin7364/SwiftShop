import Joi from 'joi'
import { categoriesWithGenres } from '../config/categoriesGenres.js'
const validCategories = Object.keys(categoriesWithGenres)

export const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required().messages({
      'string.empty': 'Title is required.',
    }),
    price: Joi.number().positive().precision(2).required().messages({
      'number.base': 'Price must be a valid number.',
      'number.positive': 'Price must be greater than zero.',
      'number.empty': 'Price is required.',
    }),
    category: Joi.string()
      .valid(...validCategories)
      .required()
      .messages({
        'any.only': 'Invalid category.',
        'string.empty': 'Category is required.',
        'any.required': 'Category is required.',
      }),
    genres: Joi.array()
      .items(Joi.string())
      .min(1)
      .required()
      .custom((genres, helpers) => {
        const category = helpers?.state?.ancestors?.[0]?.category
        const allowed = categoriesWithGenres[category] || []
        const invalid = genres.filter((g) => !allowed.includes(g))
        if (invalid.length) {
          return helpers.message(
            `Invalid genre(s) for category '${category}': ${invalid.join(', ')}`
          )
        }
        return genres
      }),
    // _genres: Joi.array().items(Joi.string()).min(1).required().messages({
    //   'array.base': 'Genres must be an array of strings',
    //   'array.min': 'At least one genre is required',
    //   'any.required': 'Genres field is required',
    // }),

    description: Joi.string().trim().allow('').messages({
      'string.empty': 'Description cannot be empty.',
    }),
    filePath: Joi.string()
      .uri()
      .required()
      .messages({
        'string.uri': 'File path must be a valid URL.',
        'any.required': 'File path is required.',
      })
      .required(),
    publisher: Joi.string().optional(),
    isbn: Joi.string().required().messages({
      'string.empty': 'ISBN is required.',
    }),
    releaseDate: Joi.date().iso().required().messages({
      'date.base': 'Release date must be a valid ISO date.',
      'any.required': 'Release date is required.',
    }),
  })

  const { error } = schema.validate(data, { abortEarly: false }) // Capture all errors
  const errors = error
    ? error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message // Map each error to its field
        return acc
      }, {})
    : {}

  return { errors, isValid: !error } // Return errors and isValid
}
