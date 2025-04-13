import { createSlice } from "@reduxjs/toolkit";
import { searchBooks } from "../action/BookAction";

const searchBookSlice = createSlice({
  name: "searchBooks",
  initialState: {
    ebooks: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.ebooks = action.payload.books;
        // state.currentPage = action.payload.currentPage;
        // state.totalPages = action.payload.totalPages;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default searchBookSlice.reducer;
