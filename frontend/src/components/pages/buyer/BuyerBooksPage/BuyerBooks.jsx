import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { showToast } from "../../../../redux/toastSlice";
import { postBookReviewAction } from "../../../../action/BookAction";

export default function BuyerBooks() {
  const [ebooks, setEbooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Load books from localStorage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem("purchasedBooks");
    if (storedBooks) {
      setEbooks(JSON.parse(storedBooks));
    }
  }, []);

  const handleGiveReview = (book) => {
    setSelectedBook(book);
    setRating(0);
    setReview("");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (!selectedBook || rating === 0) return;
    setLoading(true);
    try {
      await dispatch(
        postBookReviewAction({
          bookID: selectedBook._id,
          ratingData: { rating, comment: review },
        })
      ).unwrap();

      dispatch(showToast({ message: "Review submitted successfully!" }));
      setOpen(false);
    } catch (error) {
      dispatch(
        showToast({
          message: error || "Failed to submit review",
          severity: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: "1200px",
        minWidth: "800px",
        margin: "0 auto",
        paddingTop: 10,
        minHeight: "72vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        My Books
      </Typography>

      {ebooks.length === 0 ? (
        <Typography variant="body1">No purchased books found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {ebooks.map((ebook, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={ebook.coverImage}
                  alt={ebook.title}
                  onClick={() => window.open(ebook.url, "_blank")}
                  sx={{ cursor: "pointer" }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" noWrap>
                    {ebook.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    by {ebook.author}
                  </Typography>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => handleGiveReview(ebook)}
                    >
                      Give Rating and Review
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {selectedBook && (
          <>
            <DialogTitle
              sx={{ m: 0, p: 2, bgcolor: "#424242", color: "white" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6" fontWeight="bold">
                  Give Rating and Review
                </Typography>
                <Button
                  onClick={handleClose}
                  sx={{ minWidth: "auto", padding: 0, color: "white" }}
                >
                  ✖
                </Button>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box display="flex" alignItems="center" gap={2} mb={3} mt={1}>
                <CardMedia
                  component="img"
                  image={selectedBook.coverImage}
                  alt={selectedBook.title}
                  sx={{
                    width: 80,
                    height: 120,
                    objectFit: "cover",
                    borderRadius: 2,
                  }}
                />
                <Box>
                  <Typography variant="h6">{selectedBook.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {selectedBook.author}
                  </Typography>
                </Box>
              </Box>

              <Rating
                name="rating"
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                sx={{ mb: 2 }}
              />

              <TextField
                label="Write your review"
                multiline
                rows={4}
                fullWidth
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={loading || rating === 0}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Submit"
                )}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
