// redux/bookActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// START, Seller Book API
// Post book by Seller
export const postSellerBookAction = createAsyncThunk(
  "book/seller/post",
  async (bookData, { rejectWithValue }) => {
    try {
      console.log("bookData", bookData);
      const { data } = await axios.post(`/api/book`, bookData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to Post Book"
      );
    }
  }
);

// Edit Seller Book
export const editSellerBookAction = createAsyncThunk(
  "book/seller/edit",
  async ({ bookId, bookData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/book/${bookId}`, bookData);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to Edit Book"
      );
    }
  }
);

// Delete Seller Book
export const deleteSellerBookAction = createAsyncThunk(
  "book/seller/delete",
  async ({ bookId }, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/api/book/${bookId}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to Delete Book"
      );
    }
  }
);

// Get seller books

export const getSellerBookAction = createAsyncThunk(
  "books/seller/myBooks",
  async ({ query, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/myBooks?query=${query}&page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to get Book"
      );
    }
  }
);

// Get seller book review

export const getSellerBookReviewsAction = createAsyncThunk(
  "books/seller/myBooks/review",
  async ({ bookId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `api/book/${bookId}/reviews?page=${page}&limit=${limit}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to get Book Reviews"
      );
    }
  }
);

// END, Seller Book API

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

export const getTopRatedBooksAction = createAsyncThunk(
  "books/topRated",
  async ({ limit = 6, page = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/book/top-rated?limit=${limit}&page=${page}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Loading Top Rated Books failed"
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

export const postBookReviewAction = createAsyncThunk(
  "books/review",
  async ({ bookID, ratingData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `api/book/${bookID}/review`,
        ratingData
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "Failed to Post Review"
      );
    }
  }
);
