// redux/bookActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchBooks = createAsyncThunk(
  "books/search",
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/search?query=${query}&page=${page}&limit=10`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Book search failed"
      );
    }
  }
);

export const freeBooks = createAsyncThunk(
  "books/free",
  async ({ limit = 6, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `api/book/free?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Loading Free Books failed"
      );
    }
  }
);
