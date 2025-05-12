import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Rating,
  Pagination,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { getSellerBookReviewsAction } from "../../../../action/BookAction";

export default function SellerReviewDialog({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const { sellerBookReview, loadingSellerBookReview } = useSelector(
    (state) => state.sellerBook
  );

  useEffect(() => {
    if (bookId) {
      dispatch(getSellerBookReviewsAction({ bookId, page }));
    }
  }, [dispatch, bookId, page]);

  const handleChange = (event, value) => setPage(value);

  const { reviews = [], averageRating, totalPages } = sellerBookReview || {};

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        Ratings & Reviews
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          <strong>Average Rating:</strong> {averageRating || "N/A"}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loadingSellerBookReview ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                bgcolor: "#f9f9f9",
              }}
            >
              {reviews.length > 0 ? (
                reviews.map((r, idx) => (
                  <Box key={idx} mb={3}>
                    <Rating value={r.rating} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      "{r.comment}" – <i>{r.name}</i> on {r.createdAt}
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography>No reviews found.</Typography>
              )}
            </Box>

            {totalPages > 1 && (
              <Stack alignItems="center" mt={3}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChange}
                  color="primary"
                />
              </Stack>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
