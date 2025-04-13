import React from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box maxWidth="600px" mx="auto" mt={5} px={2}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="600"
        letterSpacing="0.5px"
        color="text.primary"
        sx={{ textTransform: "capitalize" }}
        gutterBottom
      >
        Your Profile
      </Typography>

      <Card sx={{ mt: 2, bgcolor: "#cfdddc" }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="body1">
              <strong>Name:</strong> {user.name}
            </Typography>
            <Divider />
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
