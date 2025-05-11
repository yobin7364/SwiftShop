import { createSlice } from "@reduxjs/toolkit";
import { dashboardDataAction } from "../action/dashboardAction";

const initialState = {
  // Dashboard Data
  dashboardData: [],
  loadingDashboardData: false,
  errorDashboardData: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Free Book
    builder
      .addCase(dashboardDataAction.pending, (state) => {
        state.loadingDashboardData = true;
        state.errorDashboardData = null;
      })
      .addCase(dashboardDataAction.fulfilled, (state, action) => {
        state.loadingDashboardData = false;
        state.dashboardData = action.payload;
      })
      .addCase(dashboardDataAction.rejected, (state, action) => {
        state.loadingDashboardData = false;
        state.errorDashboardData = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
