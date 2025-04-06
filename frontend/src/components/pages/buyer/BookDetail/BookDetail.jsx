import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Rating,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const BookDetail = () => {
  const [isInStock, setIsInStock] = useState(true); // initial stock status

  return (
    <Box p={4} className="main-container">
      <Grid container spacing={4}>
        {/* Book Cover */}
        <Grid item xs={12} md={4}>
          <img
            src="https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Replace with actual image path
            alt="The Light of All That Falls"
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Grid>

        {/* Book Info */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight="bold">
            The Light of All That Falls
          </Typography>
          <Typography variant="subtitle1" mt={1}>
            By <strong>James Islington</strong>
          </Typography>
          <Box display="flex" alignItems="center" mt={1}>
            {isInStock ? (
              <>
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  style={{ marginRight: 4 }}
                />
                <Typography variant="body2" color="success.main">
                  In Stock
                </Typography>
              </>
            ) : (
              <>
                <CancelIcon
                  fontSize="small"
                  color="error"
                  style={{ marginRight: 4 }}
                />
                <Typography variant="body2" color="error.main">
                  Not in Stock
                </Typography>
              </>
            )}
          </Box>

          <Rating
            name="book-rating"
            value={4.5}
            precision={0.5}
            readOnly
            sx={{ mt: 1 }}
          />

          <Typography variant="h5" mt={2} color="primary.main">
            $25.00{" "}
            <Typography
              variant="body2"
              component="span"
              sx={{ textDecoration: "line-through", ml: 1 }}
            >
              $30.00
            </Typography>
          </Typography>

          <Box mt={2} display="flex" gap={2}>
            <Button variant="outlined" startIcon={<ShoppingCartIcon />}>
              Add to Cart
            </Button>
            <Button variant="contained" color="primary">
              Buy Now
            </Button>
          </Box>

          <Box mt={2}>
            <Chip icon={<LocalOfferIcon />} label="Fantasy" sx={{ mr: 1 }} />
            <Chip label="Bestseller" color="secondary" />
          </Box>
        </Grid>
      </Grid>
      {/* Description Section */}
      <Box mt={3}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Description
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This is a brief description of the book, summarizing the plot and key
          points to give the reader an overview of what to expect.
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} /> {/* Divider between sections */}
      {/* Details Section */}
      <Box mt={3}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          Details
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Author:</strong> John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Publisher:</strong> ABC Publishing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>ISBN:</strong> 978-1234567890
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Release Date:</strong> January 2025
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} /> {/* Divider between sections */}
      {/* About the Author Section */}
      <Box mt={3}>
        <Typography variant="h6" color="text.primary" gutterBottom>
          About the Author
        </Typography>
        <Typography variant="body2" color="text.secondary">
          John Doe is an experienced writer who specializes in fantasy novels.
          His books have been featured on numerous bestseller lists, and his
          captivating storytelling has earned him a dedicated following.
        </Typography>
      </Box>
    </Box>
  );
};

export default BookDetail;
