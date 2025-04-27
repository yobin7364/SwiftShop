import React from "react";
import DiscountTable from "./DiscountTable";
import { Box } from "@mui/material";
import AddDiscount from "./AddDiscount";

export const DiscountPage = () => {
  return (
    <Box sx={{ margin: 10 }}>
      <AddDiscount />
      <DiscountTable />
    </Box>
  );
};
