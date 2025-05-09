import { createSlice } from "@reduxjs/toolkit";
import { freeBooks } from "../action/BookAction";

const initialState = {
  freeBooks: [],
  loadingFreeBooks: false,
  errorFreeBooks: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(freeBooks.pending, (state) => {
        state.loadingFreeBooks = true;
        state.errorFreeBooks = null;
      })
      .addCase(freeBooks.fulfilled, (state, action) => {
        state.loadingFreeBooks = false;
        state.freeBooks = action.payload;
      })
      .addCase(freeBooks.rejected, (state, action) => {
        state.loadingFreeBooks = false;
        state.errorFreeBooks = action.payload;
      });
  },
});

export default bookSlice.reducer;
