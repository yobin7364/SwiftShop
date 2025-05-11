import { createSlice } from "@reduxjs/toolkit";
import {
  freeBookAction,
  getSingleBookAction,
  getGenresAction,
  getEachGenreBooksAction,
  searchBooksAction,
} from "../action/BookAction";

const initialState = {
  // Free Book
  freeBooks: [],
  loadingFreeBooks: false,
  errorFreeBooks: null,

  //Single Book
  singleBook: {},
  loadingSingleBooks: false,
  errorSingleBooks: null,

  // Genres
  genreDetail: {},
  loadingGenres: false,
  errorGenres: null,

  // Genre Books
  genreBooks: [],
  loadingGenreBooks: false,
  errorGenreBooks: null,

  // Search Books
  searchBooks: [],
  loadingSearchBooks: false,
  errorSearchBooks: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Free Book
    builder
      .addCase(freeBookAction.pending, (state) => {
        state.loadingFreeBooks = true;
        state.errorFreeBooks = null;
      })
      .addCase(freeBookAction.fulfilled, (state, action) => {
        state.loadingFreeBooks = false;
        state.freeBooks = action.payload;
      })
      .addCase(freeBookAction.rejected, (state, action) => {
        state.loadingFreeBooks = false;
        state.errorFreeBooks = action.payload;
      });

    // Single Book
    builder
      .addCase(getSingleBookAction.pending, (state) => {
        state.loadingSingleBooks = true;
        state.errorSingleBooks = null;
      })
      .addCase(getSingleBookAction.fulfilled, (state, action) => {
        state.loadingSingleBooks = false;
        state.singleBook = action.payload;
      })
      .addCase(getSingleBookAction.rejected, (state, action) => {
        state.loadingSingleBooks = false;
        state.errorSingleBooks = action.payload;
      });

    // Genres
    builder
      .addCase(getGenresAction.pending, (state) => {
        state.loadingGenres = true;
        state.errorGenres = null;
      })
      .addCase(getGenresAction.fulfilled, (state, action) => {
        state.loadingGenres = false;
        state.genreDetail = action.payload;
      })
      .addCase(getGenresAction.rejected, (state, action) => {
        state.loadingGenres = false;
        state.errorGenres = action.payload;
      });

    // Genre Books
    builder
      .addCase(getEachGenreBooksAction.pending, (state) => {
        state.loadingGenreBooks = true;
        state.errorGenreBooks = null;
      })
      .addCase(getEachGenreBooksAction.fulfilled, (state, action) => {
        state.loadingGenreBooks = false;
        state.genreBooks = action.payload;
      })
      .addCase(getEachGenreBooksAction.rejected, (state, action) => {
        state.loadingGenreBooks = false;
        state.errorGenreBooks = action.payload;
      });

    // Search Books
    builder
      .addCase(searchBooksAction.pending, (state) => {
        state.loadingSearchBooks = true;
        state.errorSearchBooks = null;
      })
      .addCase(searchBooksAction.fulfilled, (state, action) => {
        state.loadingSearchBooks = false;
        state.searchBooks = action.payload;
      })
      .addCase(searchBooksAction.rejected, (state, action) => {
        state.loadingSearchBooks = false;
        state.error = action.payload;
      });
  },
});

export default bookSlice.reducer;
