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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";

export default function MyBookAdd({ onAddBook, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const onSubmit = (data) => {
    onAddBook(data);
    reset();
    setOpen(false);
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
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
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
          Add New Book
          <IconButton onClick={() => setOpen(false)} sx={{ color: "white" }}>
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
              {...register("language", { required: "Language is required" })}
              error={!!errors.language}
              helperText={errors.language?.message}
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
              <Button onClick={() => setOpen(false)}>Cancel</Button>
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
