import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice"; // Import the auth slice
import searchBookReducer from "../redux/searchBookSlice";
import bookReducer from "../redux/bookSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Register the auth slice
    searchBooks: searchBookReducer,
    books: bookReducer,
  },
});

export default store;
