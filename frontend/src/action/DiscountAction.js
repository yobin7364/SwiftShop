import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get seller discounted book

export const getSellerDiscountedBookAction = createAsyncThunk(
  "books/seller/myBooks/get/discounted",
  async ({ query = "", page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/my-discounted?query=${query}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to get Book"
      );
    }
  }
);

// Update seller discounted book

export const updateSellerDiscountedBookAction = createAsyncThunk(
  "books/seller/myBooks/add/discounted",
  async ({ bookId, discountDetail }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        `/api/book/${bookId}/discount`,
        discountDetail
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to add Book discount"
      );
    }
  }
);

// Delete seller discounted book

export const deleteSellerDiscountedBookAction = createAsyncThunk(
  "books/seller/myBooks/delete/discount",
  async ({ bookId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`api/book/${bookId}/remove-discount`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details ||
          "Failed to remove discount for book"
      );
    }
  }
);
