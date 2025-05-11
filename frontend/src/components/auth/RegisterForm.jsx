import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  Link,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../action/authAction";
import { showToast } from "../../redux/toastSlice"; // Import global toast

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
    setError,
  } = useForm({
    defaultValues: {
      role: "buyer",
    },
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();

      dispatch(
        showToast({ message: "Registration successful!", severity: "success" })
      );

      navigate("/login");
    } catch (err) {
      if (err) {
        if (err.email) {
          setError("email", { type: "manual", message: err.email });
        }
        if (err.password) {
          setError("password", { type: "manual", message: err.password });
        }
        if (err.password2) {
          setError("password2", { type: "manual", message: err.password2 });
        }
      } else {
        dispatch(
          showToast({ message: "Something went wrong", severity: "error" })
        );
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "76vh",
          pb: 2,
        }}
      >
        <Paper
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Typography variant="h5" component="h2">
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 2, width: "100%" }}
          >
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              margin="normal"
              sx={{ backgroundColor: "#ffffff" }}
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              sx={{ backgroundColor: "#ffffff" }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              sx={{ backgroundColor: "#ffffff" }}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              type="password"
              sx={{ backgroundColor: "#ffffff" }}
              {...register("password2", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords must match",
              })}
              error={!!errors.password2}
              helperText={errors.password2?.message}
            />

            {/* Role selection */}
            <FormLabel sx={{ mt: 2 }}>Role</FormLabel>
            <Controller
              name="role"
              control={control}
              defaultValue="buyer"
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel
                    value="buyer"
                    control={<Radio />}
                    label="Buyer"
                  />
                  <FormControlLabel
                    value="seller"
                    control={<Radio />}
                    label="Seller"
                  />
                </RadioGroup>
              )}
            />
            {errors.role && (
              <Alert severity="error">{errors.role?.message}</Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="secondary" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
            Already have an account?{" "}
            <Link onClick={() => navigate("/login")} sx={{ cursor: "pointer" }}>
              Log in
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
