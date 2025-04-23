import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

export default function MyBookEdit({ open, onClose, book, onEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (book) {
      reset(book);
    }
  }, [book, reset]);

  const onSubmit = (data) => {
    onEdit({ ...book, ...data });
    reset();
    onClose();
  };

  if (!book) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{
          bgcolor: "#586ba4",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Edit Book
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />
          <TextField
            fullWidth
            label="Price"
            margin="normal"
            type="number"
            {...register("price", { required: "Price is required" })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            fullWidth
            label="Category"
            margin="normal"
            {...register("category", { required: "Category is required" })}
            error={!!errors.category}
            helperText={errors.category?.message}
          />
          <TextField
            fullWidth
            label="Publisher"
            margin="normal"
            {...register("publisher", { required: "Publisher is required" })}
            error={!!errors.publisher}
            helperText={errors.publisher?.message}
          />
          <TextField
            fullWidth
            label="ISBN"
            margin="normal"
            {...register("ISBN", { required: "ISBN is required" })}
            error={!!errors.ISBN}
            helperText={errors.ISBN?.message}
          />
          <TextField
            fullWidth
            label="Release Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("releaseDate", {
              required: "Release Date is required",
            })}
            error={!!errors.releaseDate}
            helperText={errors.releaseDate?.message}
          />
          <TextField
            fullWidth
            label="Tags"
            margin="normal"
            {...register("tags")}
          />
          <TextField
            fullWidth
            label="Language"
            margin="normal"
            {...register("language")}
          />
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            {...register("description")}
          />
          <TextField
            fullWidth
            label="Cover Image URL"
            margin="normal"
            {...register("coverImage", {
              pattern: {
                value: /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\/[^\s]*)?$/,
                message: "Enter a valid URL",
              },
            })}
            error={!!errors.coverImage}
            helperText={errors.coverImage?.message}
          />
          <TextField
            fullWidth
            label="Book File URL"
            margin="normal"
            {...register("filePath", {
              pattern: {
                value: /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\/[^\s]*)?$/,
                message: "Enter a valid URL",
              },
            })}
            error={!!errors.filePath}
            helperText={errors.filePath?.message}
          />

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
