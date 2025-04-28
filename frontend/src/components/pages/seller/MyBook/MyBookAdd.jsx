import React, { useState } from "react";
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
  Chip,
  Typography,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

export default function MyBookAdd({ onAddBook, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [nowRelease, setNowRelease] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

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

  const handleClose = () => {
    setOpen(false);
    reset();
    setTags([]);
    setNowRelease(false);
  };

  const onSubmit = (data) => {
    data.tags = tags;
    if (nowRelease) {
      data.releaseDateTime = new Date().toISOString();
    }
    onAddBook(data);
    reset();
    setTags([]);
    setOpen(false);
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

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          variant="outlined"
          placeholder="Search books..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
          size="small"
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Book
        </Button>
      </Stack>

      {/* Add Book Popup */}
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
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              sx={{ mt: 1 }}
            >
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
            {/* Tags Input */}
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
            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              {...register("description")}
            />
            {/* Cover Image */}
            <TextField
              fullWidth
              label="Cover Image URL"
              margin="normal"
              {...register("coverImage", {
                required: "Cover Image URL is required",
                pattern: {
                  value: /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\/[^\s]*)?$/,
                  message: "Enter a valid URL",
                },
              })}
              error={!!errors.coverImage}
              helperText={errors.coverImage?.message}
            />
            {/* Book File URL */}
            <TextField
              fullWidth
              label="Book File URL"
              margin="normal"
              {...register("filePath", {
                required: "Book File URL is required",
                pattern: {
                  value: /^(https?:\/\/)?([\w\d\-]+\.)+[\w\d\-]+(\/[^\s]*)?$/,
                  message: "Enter a valid URL",
                },
              })}
              error={!!errors.filePath}
              helperText={errors.filePath?.message}
            />

            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
