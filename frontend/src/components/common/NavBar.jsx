import React, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import colors from "../pages/buyer/styles/colors";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { AccountCircle } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { searchBooks } from "../../action/BookAction";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function NavBar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  // Open the menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        //marginBottom: "40px"
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: colors.primary }}>
        <Toolbar
          sx={{
            backgroundColor: colors.primary,
            maxWidth: "1200px", // Set max width
            minWidth: "800px", // Set min width
            width: "100%",
            margin: "0 auto", // Center the toolbar
            px: 2, // Padding on both sides to prevent elements from touching edges
          }}
        >
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block", cursor: "pointer" } }}
            onClick={() => navigate("/")}
          >
            Swift Ebook
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search for eBooks..."
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !!searchTerm) {
                  dispatch(searchBooks({ query: searchTerm, page: 1 }));
                  //navigate("/searchResults?q=" + searchTerm); // optional route change
                }
              }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {isAuthenticated ? (
              <>
                <div style={{ marginLeft: "auto" }}>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleMenuClick}
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    sx={{ display: "flex", alignItems: "center" }} // Align items horizontally
                  >
                    <AccountCircle sx={{ marginRight: 1 }} />{" "}
                    {/* Adds space between the icon and text */}
                    <Typography variant="h6" sx={{ marginLeft: 0 }}>
                      Profile
                    </Typography>
                  </IconButton>

                  {/* Profile Menu */}
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      onClick={() => {
                        navigate("/profilePage");
                        handleClose();
                      }}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/buyerBooks");
                        handleClose();
                      }}
                    >
                      Your Book
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </div>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                  startIcon={<LoginIcon />}
                  sx={{ mr: 2 }} // Adding right margin for spacing
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate("/registerForm")}
                  startIcon={<AppRegistrationIcon />}
                  sx={{ mr: 2 }} // Adding right margin for spacing
                >
                  Register
                </Button>
              </>
            )}
          </Box>
          {/* <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
