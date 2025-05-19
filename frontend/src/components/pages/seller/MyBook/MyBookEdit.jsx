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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  editSellerBookAction,
  getSellerBookAction,
} from "../../../../action/BookAction";
import { showToast } from "../../../../redux/toastSlice";

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

  // Define the genre state
  const [genre, setGenre] = React.useState("");

  const handleGenreChange = (event) => {
    setGenre(event.target.value); // Update the genre state on selection change
  };

  useEffect(() => {
    if (book && genreList.length > 0) {
      // Map genre name (e.g., "Action") to slug (e.g., "action")
      const matchedGenre = genreList.find(
        (g) => g.name.toLowerCase() === book.genre?.toLowerCase()
      );

      // Set the genre state based on the genre from the book
      setGenre(matchedGenre ? matchedGenre.slug : "");

      // Reset form with book data
      reset({
        title: book.title || "",
        price: book.discountedPrice || "",
        genre: matchedGenre ? matchedGenre.slug : "", // Set initial genre value
        publisher: book.publisher || "",
        ISBN: book.isbn || "",
        releaseDateTime: book.releaseDate?.slice(0, 16) || "",
        description: book.description || "",
        coverImage: book.coverImage || "",
        filePath: book.file?.filePath || book.filePath || "",
      });
    }
  }, [open, book, reset]);

  useEffect(() => {
    if (error && typeof error === "string") {
      dispatch(showToast({ message: error, severity: "error" }));
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    const genreName =
      genreList.find((g) => g.slug === data.genre)?.name || data.genre;

    const bookData = {
      title: data.title,
      price: parseFloat(data.price),
      genre: genreName, // save name, not slug
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

          {/* Genre Select */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
              labelId="genre-label"
              id="genre-select"
              value={genre} // Bind genre state to value
              label="Genre"
              onChange={handleGenreChange} // Handle change
              {...register("genre", { required: "Genre is required" })}
              error={!!errors.genre}
            >
              {genreList.map((g) => (
                <MenuItem key={g.slug} value={g.slug}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
            {errors.genre && (
              <Typography color="error">{errors.genre?.message}</Typography>
            )}
          </FormControl>

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
            error={!!errors.ISBN}
            helperText={errors.ISBN?.message}
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
            <Button
              type="submit"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
