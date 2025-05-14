import { createSlice } from "@reduxjs/toolkit";
import {
  getSellerDiscountedBookAction,
  updateSellerDiscountedBookAction,
  deleteSellerDiscountedBookAction,
} from "../action/DiscountAction";

const initialState = {
  discountedBooks: [],
  loadingGetDiscounted: false,
  errorGetDiscounted: null,

  loadingUpdateDiscount: false,
  errorUpdateDiscount: null,

  loadingDeleteDiscount: false,
  errorDeleteDiscount: null,
};

const sellerDiscountSlice = createSlice({
  name: "sellerDiscount",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get Discounted Books
      .addCase(getSellerDiscountedBookAction.pending, (state) => {
        state.loadingGetDiscounted = true;
        state.errorGetDiscounted = null;
      })
      .addCase(getSellerDiscountedBookAction.fulfilled, (state, action) => {
        state.loadingGetDiscounted = false;
        state.discountedBooks = action.payload;
      })
      .addCase(getSellerDiscountedBookAction.rejected, (state, action) => {
        state.loadingGetDiscounted = false;
        state.errorGetDiscounted = action.payload;
      })

      // Update Discounted Book
      .addCase(updateSellerDiscountedBookAction.pending, (state) => {
        state.loadingUpdateDiscount = true;
        state.errorUpdateDiscount = null;
      })
      .addCase(updateSellerDiscountedBookAction.fulfilled, (state) => {
        state.loadingUpdateDiscount = false;
      })
      .addCase(updateSellerDiscountedBookAction.rejected, (state, action) => {
        state.loadingUpdateDiscount = false;
        state.errorUpdateDiscount = action.payload;
      })

      // Delete Discounted Books
      .addCase(deleteSellerDiscountedBookAction.pending, (state) => {
        state.loadingDeleteDiscounted = true;
        state.errorDeleteDiscounted = null;
      })
      .addCase(deleteSellerDiscountedBookAction.fulfilled, (state, action) => {
        state.loadingDeleteDiscounted = false;
        // state.discountedBooks = action.payload;
      })
      .addCase(deleteSellerDiscountedBookAction.rejected, (state, action) => {
        state.loadingDeleteDiscounted = false;
        state.errorDeleteDiscounted = action.payload;
      });
  },
});

export default sellerDiscountSlice.reducer;
