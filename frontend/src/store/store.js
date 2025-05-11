import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import bookReducer from "../redux/bookSlice";
import toastReducer from "../redux/toastSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Register the auth slice
    books: bookReducer,
    toast: toastReducer,
  },
});

export default store;
