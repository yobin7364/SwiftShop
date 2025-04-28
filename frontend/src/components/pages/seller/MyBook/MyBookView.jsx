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
  Chip,
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
              <strong>Release Date & Time:</strong>{" "}
              {book.releaseDateTime
                ? new Date(book.releaseDateTime).toLocaleString()
                : "-"}
            </Typography>
            <Box>
              <strong>Tags:</strong>{" "}
              {Array.isArray(book.tags) && book.tags.length > 0 ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                  {book.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  No tags
                </Typography>
              )}
            </Box>
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
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
