import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MyBookView({ open, onClose, book }) {
  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#586ba4",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        View Book Details
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Typography>
              <strong>Title:</strong> {book.title}
            </Typography>
            <Typography>
              <strong>Price:</strong> ${book.price}
            </Typography>
            <Typography>
              <strong>Category:</strong> {book.category}
            </Typography>
            <Typography>
              <strong>Publisher:</strong> {book.publisher}
            </Typography>
            <Typography>
              <strong>ISBN:</strong> {book.ISBN}
            </Typography>
            <Typography>
              <strong>Release Date:</strong> {book.releaseDate}
            </Typography>
            <Typography>
              <strong>Tags:</strong> {book.tags}
            </Typography>
            <Typography>
              <strong>Language:</strong> {book.language}
            </Typography>
            <Typography>
              <strong>Description:</strong> {book.description}
            </Typography>
            <Typography>
              <strong>Cover Image:</strong> {book.coverImage}
            </Typography>
            <Typography>
              <strong>Book File:</strong> {book.filePath}
            </Typography>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
