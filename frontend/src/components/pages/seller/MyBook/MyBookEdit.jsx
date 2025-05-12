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
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editSellerBookAction } from "../../../../action/BookAction";
import { showToast } from "../../../../redux/toastSlice";
import { getSellerBookAction } from "../../../../action/BookAction";

const genreList = [
  { name: "Action", slug: "action" },
  { name: "Adventure", slug: "adventure" },
  { name: "Mystery", slug: "mystery" },
  { name: "Science Fiction", slug: "science-fiction" },
  { name: "Romance", slug: "romance" },
  { name: "Thriller", slug: "thriller" },
  { name: "Horror", slug: "horror" },
];

export default function MyBookEdit({ open, onClose, book, onEdit }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.sellerBook.loadingEditBook);
  const error = useSelector((state) => state.sellerBook.errorEditBook);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        price: book.price,
        genre: Array.isArray(book.genres) ? book.genres[0] : book.genre,
        publisher: book.publisher,
        ISBN: book.isbn,
        releaseDateTime: book.releaseDate?.slice(0, 16),
        description: book.description,
        coverImage: book.coverImage,
        filePath: book.file?.filePath || book.filePath,
      });
    }
  }, [book, reset]);

  useEffect(() => {
    if (error && typeof error === "string") {
      dispatch(showToast({ message: error, severity: "error" }));
    }
  }, [error, dispatch]);

  const getMinDateTime = () => new Date().toISOString().slice(0, 16);

  const onSubmit = async (data) => {
    const bookData = {
      title: data.title,
      price: parseFloat(data.price),
      genre: data.genre,
      description: data.description || "",
      coverImage: data.coverImage,
      filePath: data.filePath,
      publisher: data.publisher,
      isbn: data.ISBN,
      releaseDate: data.releaseDateTime,
    };

    const resultAction = await dispatch(
      editSellerBookAction({ bookId: book._id, bookData })
    );

    if (editSellerBookAction.fulfilled.match(resultAction)) {
      dispatch(
        showToast({
          message: "Book updated successfully!",
          severity: "success",
        })
      );
      dispatch(getSellerBookAction({ query: "", page: 1 }));

      onEdit(resultAction.payload);
      onClose();
    } else if (typeof resultAction.payload === "object") {
      Object.entries(resultAction.payload).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    }
  };

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
        Edit Book
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
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
            inputMode="numeric"
            type="text"
            {...register("price", {
              required: "Price is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Only digits are allowed",
              },
            })}
            onKeyDown={(e) => {
              if (
                !/^[0-9]$/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            error={!!errors.price}
            helperText={errors.price?.message}
          />
          <TextField
            fullWidth
            label="Genre"
            margin="normal"
            select
            {...register("genre", { required: "Genre is required" })}
            error={!!errors.genre}
            helperText={errors.genre?.message}
          >
            {genreList.map((g) => (
              <MenuItem key={g.slug} value={g.name}>
                {g.name}
              </MenuItem>
            ))}
          </TextField>
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
            inputMode="numeric"
            type="text"
            {...register("ISBN", {
              required: "ISBN is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Only digits are allowed",
              },
            })}
            onKeyDown={(e) => {
              if (
                !/^[0-9]$/.test(e.key) &&
                ![
                  "Backspace",
                  "Delete",
                  "ArrowLeft",
                  "ArrowRight",
                  "Tab",
                ].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            error={!!errors.isbn}
            helperText={errors.isbn?.message}
          />

          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Release Date and Time
          </Typography>
          <TextField
            fullWidth
            label="Release DateTime"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("releaseDateTime", {
              required: "Release Date/Time is required",
            })}
            error={!!errors.releaseDateTime}
            helperText={errors.releaseDateTime?.message}
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
              required: "Cover Image URL is required",
            })}
            error={!!errors.coverImage}
            helperText={errors.coverImage?.message}
          />
          <TextField
            fullWidth
            label="Book File URL"
            margin="normal"
            {...register("filePath", {
              required: "Book File URL is required",
            })}
            error={!!errors.filePath}
            helperText={errors.filePath?.message}
          />

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
