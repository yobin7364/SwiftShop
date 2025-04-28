import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  IconButton,
  Stack,
  Typography,
  MenuItem,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

export default function MyBookEdit({ open, onClose, book, onEdit }) {
  const [tags, setTags] = useState([]);
  const [nowRelease, setNowRelease] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (book) {
      reset(book);
      setTags(Array.isArray(book.tags) ? book.tags : []);
    }
  }, [book, reset]);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(e.target.value.trim())) {
        setTags((prev) => [...prev, e.target.value.trim()]);
      }
      e.target.value = "";
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags((tags) => tags.filter((tag) => tag !== tagToDelete));
  };

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const onSubmit = (data) => {
    data.tags = tags;
    if (nowRelease) {
      data.releaseDateTime = new Date().toISOString();
    }
    onEdit({ ...book, ...data });
    reset();
    setTags([]);
    onClose();
    setNowRelease(false);
  };

  const categories = [
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Biography",
    "Children",
    "Fantasy",
  ];

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
            select
            {...register("category", { required: "Category is required" })}
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
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
            {...register("ISBN", { required: "ISBN is required" })}
            error={!!errors.ISBN}
            helperText={errors.ISBN?.message}
          />

          {/* Release Date/Time Section */}
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            Release Date and Time
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Release DateTime"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: getMinDateTime() }}
              {...register("releaseDateTime", {
                required: !nowRelease && "Release Date/Time is required",
              })}
              disabled={nowRelease}
              error={!!errors.releaseDateTime}
              helperText={errors.releaseDateTime?.message}
            />
            <Button
              variant={nowRelease ? "contained" : "outlined"}
              onClick={() => setNowRelease(!nowRelease)}
            >
              {nowRelease ? "Set Custom Time" : "Set Now"}
            </Button>
          </Stack>

          {/* Tags Section */}
          <TextField
            fullWidth
            label="Tags"
            margin="normal"
            placeholder="Type and press Enter"
            onKeyDown={handleTagKeyDown}
            InputProps={{
              startAdornment: (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleTagDelete(tag)}
                      size="small"
                    />
                  ))}
                </Box>
              ),
            }}
          />

          {/* Description Section */}
          <TextField
            fullWidth
            label="Description"
            margin="normal"
            multiline
            rows={3}
            {...register("description")}
          />

          {/* Cover Image URL Section */}
          <TextField
            fullWidth
            label="Cover Image URL"
            margin="normal"
            {...register("coverImage", {
              pattern: {
                value: /^(https?):\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,
                message: "Enter a valid URL",
              },
            })}
            error={!!errors.coverImage}
            helperText={errors.coverImage?.message}
          />

          {/* Book File URL Section */}
          <TextField
            fullWidth
            label="Book File URL"
            margin="normal"
            {...register("filePath", {
              pattern: {
                value: /^(https?):\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/,
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
