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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";

export default function DiscountEdit({ open, onClose, book, onEdit }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [finalPrice, setFinalPrice] = useState(null);
  const discountPercent = watch("discountPercent");
  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");

  useEffect(() => {
    if (book) {
      reset({
        discountPercent: book.discount || "",
        startDateTime: book.startDateTime || "",
        endDateTime: book.endDateTime || "",
      });

      if (book.price && book.discount) {
        const discountedAmount = (book.price * book.discount) / 100;
        const finalAmount = (book.price - discountedAmount).toFixed(2);
        setFinalPrice(finalAmount);
      } else {
        setFinalPrice(null);
      }
    }
  }, [book, reset]);

  useEffect(() => {
    if (book?.price && discountPercent !== undefined) {
      const discountedAmount = (book.price * discountPercent) / 100;
      const finalAmount = (book.price - discountedAmount).toFixed(2);
      setFinalPrice(finalAmount);
    }
  }, [discountPercent, book]);

  const onSubmit = (data) => {
    const start = new Date(data.startDateTime);
    const end = new Date(data.endDateTime);

    if (end <= start) {
      alert("End date and time must be after start date and time.");
      return;
    }

    const updatedDiscount = {
      ...book,
      discount: parseFloat(data.discountPercent),
      startDateTime: data.startDateTime,
      endDateTime: data.endDateTime,
    };

    onEdit(updatedDiscount);
    reset();
    onClose();
  };

  if (!book) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        Edit Discount
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          {/* Book Title (readonly) */}
          <TextField
            fullWidth
            label="Book Title"
            margin="normal"
            value={book.title}
            InputProps={{ readOnly: true }}
          />

          {/* Original Price (readonly) */}
          <TextField
            fullWidth
            label="Original Price ($)"
            margin="normal"
            value={book.price}
            InputProps={{ readOnly: true }}
          />

          {/* Discount Percentage */}
          <TextField
            fullWidth
            label="Discount Percentage (%)"
            margin="normal"
            type="number"
            {...register("discountPercent", {
              required: "Discount percent is required",
              min: { value: 0, message: "Minimum is 0%" },
              max: { value: 100, message: "Maximum is 100%" },
            })}
            error={!!errors.discountPercent}
            helperText={errors.discountPercent?.message}
          />

          {/* Start DateTime */}
          <TextField
            fullWidth
            label="Start Date and Time"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("startDateTime", {
              required: "Start Date/Time is required",
            })}
            error={!!errors.startDateTime}
            helperText={errors.startDateTime?.message}
          />

          {/* End DateTime */}
          <TextField
            fullWidth
            label="End Date and Time"
            type="datetime-local"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("endDateTime", {
              required: "End Date/Time is required",
            })}
            error={!!errors.endDateTime}
            helperText={errors.endDateTime?.message}
            inputProps={{
              min: startDateTime || undefined,
            }}
          />

          {/* Final Price */}
          {finalPrice !== null && (
            <Box mt={2}>
              <Typography variant="subtitle1">
                <strong>Final Price after Discount:</strong> ${finalPrice}
              </Typography>
            </Box>
          )}

          <DialogActions sx={{ mt: 2 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
