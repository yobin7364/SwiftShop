export const formatReview = (review) => ({
  comment: review.comment,
  rating: review.rating,
  createdAt: new Date(review.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }),
})
