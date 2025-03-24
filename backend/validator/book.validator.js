import Joi from "joi";

export const validateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().trim().required().messages({
      "string.empty": "Title is required.",
    }),
    price: Joi.number().positive().precision(2).required().messages({
      "number.base": "Price must be a valid number.",
      "number.positive": "Price must be greater than zero.",
      "number.empty": "Price is required.",
    }),
    category: Joi.string().trim().required().messages({
      "string.empty": "Category is required.",
    }),
    description: Joi.string().trim().allow("").messages({
      "string.empty": "Description cannot be empty.",
    }),
    filePath: Joi.string()
      .uri()
      .required()
      .messages({
        "string.uri": "File path must be a valid URL.",
        "any.required": "File path is required.",
      })
      .required(),
  });

  const { error } = schema.validate(data, { abortEarly: false }); // Capture all errors
  const errors = error
    ? error.details.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message; // Map each error to its field
        return acc;
      }, {})
    : {};

  return { errors, isValid: !error }; // Return errors and isValid
};
