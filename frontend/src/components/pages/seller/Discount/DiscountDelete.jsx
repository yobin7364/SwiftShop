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
import {
  deleteSellerDiscountedBookAction,
  getSellerDiscountedBookAction,
} from "../../../../action/DiscountAction";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../../redux/toastSlice";

export default function DiscountDelete({ open, onClose, onDelete, book }) {
  const dispatch = useDispatch();
  const loading = useSelector(
    (state) => state.sellerDiscount.loadingDeleteDiscounted
  );

  if (!book) return null;

  const handleDelete = async () => {
    const result = await dispatch(
      deleteSellerDiscountedBookAction({ bookId: book._id })
    );
    if (deleteSellerDiscountedBookAction.fulfilled.match(result)) {
      dispatch(
        showToast({
          message: "Book deleted successfully!",
          severity: "success",
        })
      );
      onDelete(book._id);
      dispatch(getSellerDiscountedBookAction({ query: "", page: 1 }));
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
          Are you sure you want to delete discount for{" "}
          <strong>{book.title}</strong>?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          {loading ? <CircularProgress size={20} color="inherit" /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
