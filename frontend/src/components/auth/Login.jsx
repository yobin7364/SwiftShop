import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { login } from "../../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(userData)); // Call thunk
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="h2">
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            name="email"
            type="email"
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            name="password"
            type="password"
            onChange={handleChange}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default Login;
