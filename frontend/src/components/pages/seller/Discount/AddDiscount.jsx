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
  Autocomplete,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";

export default function AddDiscount({ onAddDiscount }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [discountPercent, setDiscountPercent] = useState("");
  const [finalPrice, setFinalPrice] = useState(null);

  // 🔥 Sample books inside component
  const books = [
    {
      id: 1,
      title: "The Light of All That Falls",
      author: "James Islington",
      price: 30,
      category: "Fantasy",
    },
    {
      id: 2,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 25,
      category: "Thriller",
    },
    {
      id: 3,
      title: "Atomic Habits",
      author: "James Clear",
      price: 20,
      category: "Self-help",
    },
    {
      id: 4,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      price: 22,
      category: "Mystery",
    },
    {
      id: 5,
      title: "The Alchemist",
      author: "Paulo Coelho",
      price: 18,
      category: "Adventure",
    },
    {
      id: 6,
      title: "Educated",
      author: "Tara Westover",
      price: 24,
      category: "Biography",
    },
  ];

  const { handleSubmit, reset } = useForm();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    setDiscountPercent(value);

    if (selectedBook && value >= 0 && value <= 100) {
      const discountedAmount = (selectedBook.price * value) / 100;
      const finalAmount = (selectedBook.price - discountedAmount).toFixed(2);
      setFinalPrice(finalAmount);
    } else {
      setFinalPrice(null);
    }
  };

  const onSubmit = () => {
    if (!selectedBook || discountPercent === "") return;

    const discountData = {
      selectedBook,
      discountPercent,
      finalPrice,
    };

    onAddDiscount(discountData);
    reset();
    setSelectedBook(null);
    setDiscountPercent("");
    setFinalPrice(null);
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
          Add Discount
        </Button>
      </Stack>

      {/* Add Discount Popup */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
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
          Add Discount
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
            {/* Select Book */}
            <Autocomplete
              options={books}
              getOptionLabel={(option) => `${option.title} - ${option.author}`}
              onChange={(_, value) => {
                setSelectedBook(value);
                setDiscountPercent("");
                setFinalPrice(null);
              }}
              renderInput={(params) => (
                <TextField {...params} label="Select Book" margin="normal" />
              )}
            />

            {/* Enter Discount % */}
            <TextField
              fullWidth
              label="Discount Percentage (%)"
              margin="normal"
              type="number"
              value={discountPercent}
              onChange={handleDiscountChange}
              inputProps={{ min: 0, max: 100 }}
            />

            {/* Show Final Price */}
            {finalPrice !== null && (
              <Box mt={2}>
                <Typography variant="subtitle1">
                  <strong>Original Price:</strong> ${selectedBook?.price}
                </Typography>
                <Typography variant="subtitle1" color="success.main">
                  <strong>Final Price after Discount:</strong> ${finalPrice}
                </Typography>
              </Box>
            )}

            <DialogActions sx={{ mt: 2 }}>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!selectedBook || discountPercent === ""}
              >
                Add Discount
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
