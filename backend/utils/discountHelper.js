// utils/discountHelper.js

/**
 * Checks if a book's discount is currently active.
 * @param {Object} book - Plain object or Mongoose document with discountStart, discountEnd, discountPercentage.
 * @param {Date} [now=new Date()] - Reference time for checking.
 * @returns {boolean}
 */
export function isDiscountActive(book, now = new Date()) {
  const { discountStart, discountEnd, discountPercentage } = book
  if (!discountStart || !discountEnd || !discountPercentage) return false
  const start = new Date(discountStart)
  const end = new Date(discountEnd)
  return now >= start && now <= end
}

/**
 * Calculates the discounted price if the discount is active.
 * @param {Object} book - Book object with price and discountPercentage.
 * @param {Date} [now=new Date()]
 * @returns {number|null} - Discounted price or null if no active discount.
 */
export function getDiscountedPrice(book, now = new Date()) {
  if (!isDiscountActive(book, now)) return null
  const discounted = book.price * (1 - book.discountPercentage / 100)
  return parseFloat(discounted.toFixed(2))
}

/**
 * Serializes discount date fields to ISO strings for frontend consumption.
 * @param {Object} book
 * @returns {{discountStartISO: string|null, discountEndISO: string|null}}
 */
export function serializeDiscountDates(book) {
  return {
    discountStartISO: book.discountStart
      ? new Date(book.discountStart).toISOString()
      : null,
    discountEndISO: book.discountEnd
      ? new Date(book.discountEnd).toISOString()
      : null,
  }
}

/**
 * Formats a book object with discount metadata for API responses.
 * Includes discountedPrice, discountActive, and ISO date fields.
 * @param {Object} book - Mongoose document or plain object.
 * @returns {Object} - New object ready for JSON response.
 */
export function formatBookWithDiscount(book) {
  // Convert Mongoose doc to plain object if needed
  const base = book.toObject ? book.toObject() : { ...book }
  const now = new Date()
  const active = isDiscountActive(base, now)
  const discountedPrice = getDiscountedPrice(base, now)
  const { discountStartISO, discountEndISO } = serializeDiscountDates(base)

  return {
    ...base,
    discountActive: active,
    discountedPrice,
    discountStart: discountStartISO,
    discountEnd: discountEndISO,
  }
}
