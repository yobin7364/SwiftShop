import React from "react";
import MyBookTable from "./MyBookTable";
import MyBookAdd from "./MyBookAdd";
import { Box } from "@mui/material";

export const MyBookPage = () => {
  return (
    <Box sx={{ margin: 10 }}>
      <MyBookAdd />
      <MyBookTable />
    </Box>
  );
};
