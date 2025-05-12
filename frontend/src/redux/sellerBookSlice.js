import { createSlice } from "@reduxjs/toolkit";
import {
  postSellerBookAction,
  editSellerBookAction,
  deleteSellerBookAction,
  getSellerBookAction,
  getSellerBookReviewsAction,
} from "../action/BookAction";

const initialState = {
  myBooks: [],
  loadingMyBooks: false,
  errorMyBooks: null,

  loadingPostBook: false,
  errorPostBook: null,

  loadingEditBook: false,
  errorEditBook: null,

  loadingDeleteBook: false,
  errorDeleteBook: null,

  sellerBookReview: [],
  loadingSellerBookReview: false,
  errorSellerBookReview: null,
};

const sellerBookSlice = createSlice({
  name: "sellerBooks",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    // Get My Books
    builder
      .addCase(getSellerBookAction.pending, (state) => {
        state.loadingMyBooks = true;
        state.errorMyBooks = null;
      })
      .addCase(getSellerBookAction.fulfilled, (state, action) => {
        state.loadingMyBooks = false;
        state.myBooks = action.payload;
      })
      .addCase(getSellerBookAction.rejected, (state, action) => {
        state.loadingMyBooks = false;
        state.errorMyBooks = action.payload;
      });

    // Post Book
    builder
      .addCase(postSellerBookAction.pending, (state) => {
        state.loadingPostBook = true;
        state.errorPostBook = null;
      })
      .addCase(postSellerBookAction.fulfilled, (state) => {
        state.loadingPostBook = false;
      })
      .addCase(postSellerBookAction.rejected, (state, action) => {
        state.loadingPostBook = false;
        state.errorPostBook = action.payload;
      });

    // Edit Book
    builder
      .addCase(editSellerBookAction.pending, (state) => {
        state.loadingEditBook = true;
        state.errorEditBook = null;
      })
      .addCase(editSellerBookAction.fulfilled, (state) => {
        state.loadingEditBook = false;
      })
      .addCase(editSellerBookAction.rejected, (state, action) => {
        state.loadingEditBook = false;
        state.errorEditBook = action.payload;
      });

    // Delete Book
    builder
      .addCase(deleteSellerBookAction.pending, (state) => {
        state.loadingDeleteBook = true;
        state.errorDeleteBook = null;
      })
      .addCase(deleteSellerBookAction.fulfilled, (state) => {
        state.loadingDeleteBook = false;
      })
      .addCase(deleteSellerBookAction.rejected, (state, action) => {
        state.loadingDeleteBook = false;
        state.errorDeleteBook = action.payload;
      });

    // Get My Books Review
    builder
      .addCase(getSellerBookReviewsAction.pending, (state) => {
        state.loadingSellerBookReview = true;
        state.errorSellerBookReview = null;
      })
      .addCase(getSellerBookReviewsAction.fulfilled, (state, action) => {
        state.loadingSellerBookReview = false;
        state.sellerBookReview = action.payload;
      })
      .addCase(getSellerBookReviewsAction.rejected, (state, action) => {
        state.loadingSellerBookReview = false;
        state.errorSellerBookReview = action.payload;
      });
  },
});

export default sellerBookSlice.reducer;
