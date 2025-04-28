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
import { useForm } from "react-hook-form";

export default function AddDiscount({ onAddDiscount }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [discountPercent, setDiscountPercent] = useState("");
  const [finalPrice, setFinalPrice] = useState(null);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const books = [
    {
      id: 1,
      title: "The Light of All That Falls",
      author: "James Islington",
      price: 30,
    },
    {
      id: 2,
      title: "The Silent Patient",
      author: "Alex Michaelides",
      price: 25,
    },
    { id: 3, title: "Atomic Habits", author: "James Clear", price: 20 },
    {
      id: 4,
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      price: 22,
    },
    { id: 5, title: "The Alchemist", author: "Paulo Coelho", price: 18 },
    { id: 6, title: "Educated", author: "Tara Westover", price: 24 },
  ];

  const { handleSubmit, reset } = useForm();

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

  const isValidDiscountPeriod = () => {
    const now = new Date();
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    return start > now && end > start;
  };

  const onSubmit = () => {
    if (
      !selectedBook ||
      discountPercent === "" ||
      !startDateTime ||
      !endDateTime
    )
      return;

    if (!isValidDiscountPeriod()) {
      alert(
        "Start Date/Time must be after now, and End Date/Time must be after Start Date/Time."
      );
      return;
    }

    const discountData = {
      selectedBook,
      discountPercent,
      finalPrice,
      startDateTime,
      endDateTime,
    };

    onAddDiscount(discountData);

    reset();
    setSelectedBook(null);
    setDiscountPercent("");
    setFinalPrice(null);
    setStartDateTime("");
    setEndDateTime("");
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedBook(null);
    setDiscountPercent("");
    setFinalPrice(null);
    setStartDateTime("");
    setEndDateTime("");
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
          <IconButton onClick={() => handleClose()} sx={{ color: "white" }}>
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

            {/* Start Date & Time */}
            <TextField
              fullWidth
              label="Start Date and Time"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              inputProps={{ min: getCurrentDateTime() }}
            />

            {/* End Date & Time */}
            <TextField
              fullWidth
              label="End Date and Time"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              inputProps={{ min: startDateTime || getCurrentDateTime() }}
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
              <Button onClick={() => handleClose()}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  !selectedBook ||
                  discountPercent === "" ||
                  !startDateTime ||
                  !endDateTime
                }
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
