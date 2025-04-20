import React, { useEffect } from "react";
import { Box, Typography, Stack, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Footer = () => {
  const currentRole = useSelector((state) => state.auth.user?.role[0]);

  return (
    <Box
      sx={{
        bgcolor: currentRole == "seller" ? "#586ba4" : "#69a69e",
        color: "white",
        py: 4,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        justifyContent="space-between"
        alignItems="center"
        sx={{ maxWidth: "1200px", mx: "auto", px: 2 }}
      >
        {/* Left Side - Title */}
        <Typography variant="h6">
          © {new Date().getFullYear()} Swift Ebook
        </Typography>

        {/* Right Side - Social Media */}
        <Stack direction="row" spacing={2}>
          <IconButton sx={{ color: "white" }}>
            <Facebook />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <Twitter />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <Instagram />
          </IconButton>
          <IconButton sx={{ color: "white" }}>
            <LinkedIn />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
