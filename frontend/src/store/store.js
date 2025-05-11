import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/authSlice";
import bookReducer from "../redux/bookSlice";
import toastReducer from "../redux/toastSlice";
import dashboardReducer from "../redux/dashboadSlice";
import sellerBookReducer from "../redux/sellerBookSlice";

const store = configureStore({
  reducer: {
    auth: authReducer, // Register the auth slice
    books: bookReducer,
    toast: toastReducer,
    dashboard: dashboardReducer,
    sellerBook: sellerBookReducer,
  },
});

export default store;
