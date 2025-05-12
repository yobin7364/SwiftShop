import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { deleteSellerBookAction } from "../../../../action/BookAction";
import { showToast } from "../../../../redux/toastSlice";
import { getSellerBookAction } from "../../../../action/BookAction";

export default function MyBookDelete({ open, onClose, book, onDelete }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.sellerBook.loadingDeleteBook);

  if (!book) return null;

  const handleDelete = async () => {
    const result = await dispatch(deleteSellerBookAction({ bookId: book._id }));
    if (deleteSellerBookAction.fulfilled.match(result)) {
      dispatch(
        showToast({
          message: "Book deleted successfully!",
          severity: "success",
        })
      );
      onDelete(book._id);
      dispatch(getSellerBookAction({ query: "", page: 1 }));
    } else {
      dispatch(
        showToast({
          message: result.payload || "Failed to delete book",
          severity: "error",
        })
      );
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: "#d32f2f",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Confirm Delete
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Are you sure you want to delete <strong>{book.title}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
