import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const dashboardDataAction = createAsyncThunk(
  "seller/dashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/seller/dashboard");
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error?.details || "No dashboard Data"
      );
    }
  }
);
