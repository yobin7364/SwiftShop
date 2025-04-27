import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Pagination,
  Divider,
  Rating,
  Stack,
} from "@mui/material";

// Sample reviews data
const sampleReviews = [
  { id: 1, rating: 4.5, review: "Amazing book! Really loved it." },
  { id: 2, rating: 3.0, review: "Good read but a bit slow in the middle." },
  { id: 3, rating: 5.0, review: "Masterpiece!" },
  { id: 4, rating: 2.5, review: "Not my type. Found it boring." },
  { id: 5, rating: 4.0, review: "Very inspirational and well-written." },
  { id: 6, rating: 1.5, review: "Didn't enjoy it." },
  { id: 7, rating: 4.8, review: "Absolutely fantastic!" },
  { id: 8, rating: 3.5, review: "Worth a try, not amazing though." },
  { id: 9, rating: 5.0, review: "One of the best I've ever read!" },
  { id: 10, rating: 2.0, review: "Mediocre writing, weak plot." },
  { id: 11, rating: 4.2, review: "Good book with a few surprises." },
  { id: 12, rating: 3.7, review: "Enjoyable but predictable ending." },
];

const itemsPerPage = 5; // Number of reviews per page

export default function SellerRatingsPage() {
  const [page, setPage] = useState(1);
  const [currentReviews, setCurrentReviews] = useState([]);

  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setCurrentReviews(sampleReviews.slice(start, end));
  }, [page]);

  const minRating = Math.min(...sampleReviews.map((r) => r.rating));
  const maxRating = Math.max(...sampleReviews.map((r) => r.rating));

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Box
        sx={{
          minWidth: 600, // Minimum width for container
          maxWidth: 1000, // Maximum width for container
          width: "100%",
          minHeight: 400, // Minimum height for review box (Adjust this as needed)
          p: 4,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Ratings & Reviews
        </Typography>

        {/* Min and Max Ratings */}
        <Stack direction="row" spacing={4} mb={2}>
          <Typography variant="body1">
            <strong>Minimum Rating:</strong> {minRating}
          </Typography>
          <Typography variant="body1">
            <strong>Maximum Rating:</strong> {maxRating}
          </Typography>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Review List */}
        <Box
          sx={{
            maxHeight: 500,
            minHeight: 200, // Minimum height to ensure it doesn't collapse
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            bgcolor: "#f9f9f9",
          }}
        >
          {currentReviews.map((review) => (
            <Box key={review.id} mb={3}>
              <Rating value={review.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" mt={1}>
                "{review.review}"
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))}
        </Box>

        {/* Pagination */}
        <Stack alignItems="center" mt={3}>
          <Pagination
            count={Math.ceil(sampleReviews.length / itemsPerPage)}
            page={page}
            onChange={handleChange}
            color="primary"
          />
        </Stack>
      </Box>
    </Box>
  );
}
