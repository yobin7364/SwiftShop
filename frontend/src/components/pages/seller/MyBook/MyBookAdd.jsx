import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  IconButton,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { postSellerBookAction } from "../../../../action/BookAction";
import { showToast } from "../../../../redux/toastSlice";
import { getSellerBookAction } from "../../../../action/BookAction";

const genreList = [
  {
    name: "Action",
    slug: "action",
    image:
      "https://img.freepik.com/free-vector/superhero-comic-style-illustration_23-2148975014.jpg", // Cartoon action
  },
  {
    name: "Adventure",
    slug: "adventure",
    image:
      "https://img.freepik.com/free-vector/cartoon-adventure-background-with-map-elements_23-2148999783.jpg", // Adventure map
  },
  {
    name: "Mystery",
    slug: "mystery",
    image:
      "https://img.freepik.com/free-vector/comic-style-mystery-background_23-2148994460.jpg", // Mystery comic
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    image:
      "https://img.freepik.com/free-vector/science-fiction-cartoon-background_23-2148961577.jpg", // Sci-fi cartoon
  },
  {
    name: "Romance",
    slug: "romance",
    image:
      "https://img.freepik.com/free-vector/romantic-couple-cartoon-illustration_23-2148958132.jpg", // Romance cartoon
  },
  {
    name: "Thriller",
    slug: "thriller",
    image:
      "https://img.freepik.com/free-vector/thriller-movie-poster-with-silhouette_23-2148667094.jpg", // Thriller dark
  },
  {
    name: "Horror",
    slug: "horror",
    image:
      "https://img.freepik.com/free-vector/horror-movie-background-with-haunted-house_23-2148658203.jpg", // Horror haunted
  },
  {
    name: "Health",
    slug: "health",
    image:
      "https://img.freepik.com/free-vector/healthy-lifestyle-cartoon-illustration_23-2148552951.jpg", // Cartoon health
  },
];

export default function MyBookAdd() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.sellerBook.loadingPostBook);
  const error = useSelector((state) => state.sellerBook.errorPostBook);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (error && typeof error === "string") {
      dispatch(showToast({ message: error, severity: "error" }));
    }
  }, [error, dispatch]);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

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

    const resultAction = await dispatch(postSellerBookAction(bookData));

    if (postSellerBookAction.fulfilled.match(resultAction)) {
      dispatch(
        showToast({ message: "Book added successfully!", severity: "success" })
      );
      dispatch(getSellerBookAction({ query: "", page: 1 }));

      handleClose();
    } else if (typeof resultAction.payload === "object") {
      Object.entries(resultAction.payload).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Book
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            bgcolor: "#586ba4",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Add New Book
          <IconButton onClick={handleClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2 }}
          >
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
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add"
                )}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
