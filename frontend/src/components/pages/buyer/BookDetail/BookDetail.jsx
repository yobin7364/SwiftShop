import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useDispatch, useSelector } from "react-redux";
import { getSingleBookAction } from "../../../../action/BookAction";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const BookDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookID } = useParams();

  const [paymentStatus, setPaymentStatus] = useState("idle");
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    singleBook: { book } = {},
    loadingSingleBooks: isLoading,
    errorSigleBooks: error,
  } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(getSingleBookAction({ bookID }));
  }, [dispatch, bookID]);

  const handleBuyNow = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }, 2000);
  };

  if (isLoading) {
    return (
      <Box p={4} sx={{ paddingTop: 10 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} width="100%" />
          </Grid>
          <Grid item xs={12} md={8}>
            <Skeleton variant="text" height={60} width="80%" />
            <Skeleton variant="text" height={30} width="60%" />
            <Skeleton variant="text" height={30} width="30%" sx={{ mt: 2 }} />
            <Skeleton
              variant="rectangular"
              height={40}
              width={150}
              sx={{ mt: 2 }}
            />
            <Skeleton variant="text" height={20} width="50%" sx={{ mt: 2 }} />
          </Grid>
        </Grid>
        <Skeleton variant="text" height={30} width="30%" sx={{ mt: 4 }} />
        <Skeleton variant="rectangular" height={150} sx={{ mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} sx={{ paddingTop: 10 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box p={4} sx={{ paddingTop: 10 }}>
        <Typography>No book found.</Typography>
      </Box>
    );
  }

  const discountedPrice =
    book.discountPercentage > 0
      ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
      : book.price;

  return (
    <Box p={4} className="main-container" sx={{ paddingTop: 10 }}>
      <Grid container spacing={4}>
        {/* Book Cover */}
        <Grid item xs={12} md={4}>
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Grid>

        {/* Book Info */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight="bold">
            {book.title}
          </Typography>
          <Typography variant="subtitle1" mt={1}>
            By <strong>{book.author.name}</strong>
          </Typography>

          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" fontWeight="bold">
                {book.averageRating || 0}
              </Typography>
              <Rating
                name="book-rating"
                value={book.averageRating || 0}
                precision={0.5}
                readOnly
              />
            </Box>
            <Typography variant="body2" color="secondary">
              {book.reviews.length} Reviews
            </Typography>
          </Box>

          <Typography variant="h5" mt={2} color="primary.main">
            ${discountedPrice}
            {book.discountPercentage > 0 && (
              <Typography
                variant="body2"
                component="span"
                sx={{ textDecoration: "line-through", ml: 1 }}
              >
                ${book.price}
              </Typography>
            )}
          </Typography>

          <Box mt={2} display="flex" flexDirection="column" gap={1}>
            <Box position="relative" display="inline-flex">
              <Button
                variant="contained"
                color="primary"
                onClick={handleBuyNow}
                disabled={!isAuthenticated || paymentStatus !== "idle"}
                sx={{ minWidth: 150 }}
              >
                {paymentStatus === "processing" ? "Processing..." : "Buy Now"}
              </Button>
              {paymentStatus === "processing" && (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginTop: "-12px",
                    marginLeft: "-12px",
                  }}
                />
              )}
            </Box>

            {paymentStatus === "success" && (
              <Typography
                variant="body2"
                color="success.main"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                Payment Successful!
              </Typography>
            )}
          </Box>

          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            <Chip icon={<LocalOfferIcon />} label={book.category} />
            {book.genres.map((g, i) => (
              <Chip key={i} label={g} />
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Description */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Details */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <Typography variant="body2">
          <strong>Author:</strong> {book.author.name}
        </Typography>
        <Typography variant="body2">
          <strong>Publisher:</strong> {book.publisher}
        </Typography>
        <Typography variant="body2">
          <strong>ISBN:</strong> {book.isbn}
        </Typography>
        <Typography variant="body2">
          <strong>Release Date:</strong> {book.releaseDateFormatted}
        </Typography>
      </Box>

      {/* <Divider sx={{ my: 2 }} /> */}

      {/* About Author */}
      {/* <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          About the Author
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {book.author.name} is a talented writer known for their unique
          storytelling and contributions to {book.category} literature.
        </Typography>
      </Box> */}

      <Divider sx={{ my: 2 }} />

      {/* Ratings and Reviews */}
      <Box mt={5}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Ratings & Reviews
        </Typography>

        {book?.reviews?.length === 0 ? (
          <Typography variant="h7" color="text.secondary" gutterBottom>
            No Ratings & Reviews
          </Typography>
        ) : (
          book?.reviews?.map((review, index) => (
            <Box key={index} mb={2}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography
                variant="body2"
                color="text.secondary"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <em>"{review.comment}"</em> —
                <PersonOutlineIcon fontSize="small" />
                {review.user}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default BookDetail;
