// redux/bookActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const searchBooksAction = createAsyncThunk(
  "books/search",
  async ({ query, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/search?query=${query}&page=${page}&limit=10`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Book search failed"
      );
    }
  }
);

export const freeBookAction = createAsyncThunk(
  "books/free",
  async ({ limit = 6, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/free?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Loading Free Books failed"
      );
    }
  }
);

export const getSingleBookAction = createAsyncThunk(
  "books/single",
  async ({ bookID }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/book/${bookID}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Loading Single Book failed"
      );
    }
  }
);

export const getGenresAction = createAsyncThunk(
  "books/get/genres",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/book/genres`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Loading Genres failed"
      );
    }
  }
);

export const getEachGenreBooksAction = createAsyncThunk(
  "books/get/genre/book",
  async ({ genreSlug, limit = 6, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/genre/${genreSlug}?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Loading Genre Books failed"
      );
    }
  }
);
