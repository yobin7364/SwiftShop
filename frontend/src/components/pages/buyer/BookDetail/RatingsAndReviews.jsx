import React, { useState } from "react";
import { Box, Typography, Rating, Divider, Pagination } from "@mui/material";

const reviews = [
  { rating: 5, comment: "Amazing book! Loved it.", user: "Anonymous" },
  { rating: 4, comment: "Really good, just a bit long.", user: "Anonymous" },
  {
    rating: 3.5,
    comment: "Decent read but pacing was slow.",
    user: "Anonymous",
  },
  { rating: 5, comment: "Masterpiece, 10/10.", user: "Anonymous" },
  { rating: 4.5, comment: "Great plot twists!", user: "Anonymous" },
  { rating: 4, comment: "Enjoyed it thoroughly.", user: "Anonymous" },
  { rating: 5, comment: "Couldn't put it down.", user: "Anonymous" },
  { rating: 3, comment: "Not my type but still okay.", user: "Anonymous" },
  // Add more if you want
];

const REVIEWS_PER_PAGE = 3; // how many reviews per page

const RatingsAndReviews = () => {
  const [page, setPage] = useState(1);

  // Calculate which reviews to show
  const startIndex = (page - 1) * REVIEWS_PER_PAGE;
  const endIndex = startIndex + REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(startIndex, endIndex);

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box mt={5}>
      <Typography variant="h6" color="text.primary" gutterBottom>
        Ratings & Reviews
      </Typography>

      {currentReviews.map((review, index) => (
        <Box key={index} mb={2}>
          <Rating value={review.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            "{review.comment}" — {review.user}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box display="flex" justifyContent="center">
        <Pagination
          count={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
          page={page}
          onChange={handleChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default RatingsAndReviews;
