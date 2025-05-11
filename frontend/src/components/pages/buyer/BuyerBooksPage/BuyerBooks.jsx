import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
} from "@mui/material";

import CommonToast from "../../../common/CommonToast";

const ebooks = [
  {
    title: "Buchanan's Express",
    image:
      "https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "John Doe",
  },
  {
    title: "Blackstone",
    image:
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Jane Smith",
  },
  {
    title: "Gitel’s Freedom",
    image:
      "https://images.unsplash.com/photo-1641154748135-8032a61a3f80?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Paul Johnson",
  },
  {
    title: "Ice Age",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    author: "Emily Brown",
  },
];

const ITEMS_PER_PAGE = 4;

export default function BuyerBooks() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleChange = (event, value) => {
    setPage(value);
  };

  // For snack bar

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleGiveReview = (book) => {
    setSelectedBook(book);
    setRating(0);
    setReview("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("Submitting Review:", {
      bookTitle: selectedBook.title,
      rating,
      review,
    });
    setOpen(false);
    showSnackbar("Review submitted successfully!", "success");
    // Here you would send (bookId, rating, review) anonymously to your backend
  };

  const paginatedEbooks = ebooks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

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

      <Grid container spacing={3}>
        {paginatedEbooks.map((ebook, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={ebook.image}
                alt={ebook.title}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" noWrap>
                  {ebook.title}
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

      <Pagination
        count={Math.ceil(ebooks.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={handleChange}
        sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}
      />

      {/* Review Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        {selectedBook && (
          <>
            <DialogTitle sx={{ m: 0, p: 2 }}>
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
                  sx={{ minWidth: "auto", padding: 0 }}
                >
                  ✖
                </Button>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Box display="flex" alignItems="center" gap={2} mb={3} mt={1}>
                <CardMedia
                  component="img"
                  image={selectedBook.image}
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
              <Button onClick={handleSubmit} variant="contained">
                Submit
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <CommonToast
        open={openSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={handleCloseSnackbar}
      />
    </Box>
  );
}
