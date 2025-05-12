import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  Autocomplete,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getSellerBookAction } from "../../../../action/BookAction";
import { updateSellerDiscountedBookAction } from "../../../../action/DiscountAction";
import { showToast } from "../../../../redux/toastSlice";
import { getSellerDiscountedBookAction } from "../../../../action/DiscountAction";

export default function AddDiscount() {
  const dispatch = useDispatch();
  const { myBooks } = useSelector((state) => state.sellerBook);
  const loading = useSelector(
    (state) => state.sellerDiscount.loadingUpdateDiscount
  );

  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const discountPercentage = watch("discountPercentage");
  const discountStart = watch("discountStart");
  const discountEnd = watch("discountEnd");

  useEffect(() => {
    dispatch(getSellerBookAction({ query: "", page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedBook && discountPercentage >= 0 && discountPercentage <= 100) {
      const discountedAmount = (selectedBook.price * discountPercentage) / 100;
      const finalAmount = (selectedBook.price - discountedAmount).toFixed(2);
      setFinalPrice(finalAmount);
    } else {
      setFinalPrice(null);
    }
  }, [discountPercentage, selectedBook]);

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedBook(null);
    setFinalPrice(null);
  };

  const getCurrentDateTime = () => {
    return new Date().toISOString().slice(0, 16);
  };

  const onSubmit = async (data) => {
    if (!selectedBook) {
      setError("bookId", {
        type: "manual",
        message: "Book selection is required",
      });
      return;
    }

    const discountDetail = {
      discountPercentage: Number(data.discountPercentage),
      discountStart: data.discountStart,
      discountEnd: data.discountEnd,
    };

    const result = await dispatch(
      updateSellerDiscountedBookAction({
        bookId: selectedBook._id,
        discountDetail,
      })
    );

    if (updateSellerDiscountedBookAction.fulfilled.match(result)) {
      dispatch(
        showToast({
          message: "Discount applied successfully!",
          severity: "success",
        })
      );

      dispatch(
        getSellerDiscountedBookAction({
          page: 1,
        })
      );

      handleClose();
    } else if (typeof result.payload === "object") {
      Object.entries(result.payload).forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    } else {
      dispatch(
        showToast({
          message: result.payload || "Failed to apply discount",
          severity: "error",
        })
      );
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Discount
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
            <>
              <Autocomplete
                options={myBooks?.books || []}
                getOptionLabel={(option) =>
                  `${option.title} - ${option.publisher}`
                }
                onChange={(_, value) => {
                  setSelectedBook(value);
                  setValue("bookId", value?._id || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Book"
                    margin="normal"
                    error={!!errors.bookId}
                    helperText={errors.bookId?.message}
                  />
                )}
              />
              <input
                type="hidden"
                {...register("bookId", {
                  required: "Book selection is required",
                })}
              />
            </>

            <TextField
              fullWidth
              label="Discount Percentage (%)"
              margin="normal"
              type="number"
              {...register("discountPercentage", {
                required: "Discount percent is required",
                min: { value: 0, message: "Minimum is 0%" },
                max: { value: 100, message: "Maximum is 100%" },
              })}
              error={!!errors.discountPercentage}
              helperText={errors.discountPercentage?.message}
            />

            <TextField
              fullWidth
              label="Start Date and Time"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register("discountStart", {
                required: "Start date/time is required",
              })}
              error={!!errors.discountStart}
              helperText={errors.discountStart?.message}
              inputProps={{
                min:
                  selectedBook?.releaseDate?.slice(0, 16) ||
                  getCurrentDateTime(),
              }}
            />

            <TextField
              fullWidth
              label="End Date and Time"
              type="datetime-local"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              {...register("discountEnd", {
                required: "End date/time is required",
              })}
              error={!!errors.discountEnd}
              helperText={errors.discountEnd?.message}
              inputProps={{ min: discountStart || getCurrentDateTime() }}
            />

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
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Add Discount"
                )}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
