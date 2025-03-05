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
import { registerUser } from "../../action/authAction";

const Register = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userData.password !== userData.password2) {
      alert("Passwords do not match");
      return;
    }
    dispatch(
      registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
      })
    );
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
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2, width: "100%" }}
        >
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            name="name"
            onChange={handleChange}
            required
          />
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
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            name="password2"
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
            {loading ? "Registering..." : "Register"}
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

export default Register;
