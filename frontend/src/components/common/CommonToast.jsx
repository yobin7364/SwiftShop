import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { hideToast } from "../../redux/toastSlice";

const CommonToast = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.toast);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => dispatch(hideToast())}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CommonToast;
