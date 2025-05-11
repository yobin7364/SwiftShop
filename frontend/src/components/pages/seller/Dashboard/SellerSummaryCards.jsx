import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarRateIcon from "@mui/icons-material/StarRate";

export default function SellerSummaryCards({
  totalBooks = 0,
  totalSales = 0,
  totalRevenue = 0,
  avgRating = 0,
}) {
  const cardStyles = {
    height: 180,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: 3,
    borderRadius: 2,
  };

  const iconStyle = { fontSize: 40, marginBottom: 1 };

  return (
    <Grid container spacing={3} sx={{ ml: 0 }}>
      <Grid item xs={12} sm={6} md={3} sx={{ pl: 0 }}>
        <Card sx={{ ...cardStyles, bgcolor: "#b2ebf2" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <LibraryBooksIcon sx={iconStyle} />
            <Typography variant="h6" fontWeight="bold">
              Your Books
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>
              {totalBooks}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ ...cardStyles, bgcolor: "#ffcc80" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <ShoppingCartIcon sx={iconStyle} />
            <Typography variant="h6" fontWeight="bold">
              Total Sales
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>
              {totalSales}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ ...cardStyles, bgcolor: "#a5d6a7" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <AttachMoneyIcon sx={iconStyle} />
            <Typography variant="h6" fontWeight="bold">
              Revenue
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>
              ${Number(totalRevenue).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ ...cardStyles, bgcolor: "#b39ddb" }}>
          <CardContent sx={{ textAlign: "center" }}>
            <StarRateIcon sx={iconStyle} />
            <Typography variant="h6" fontWeight="bold">
              Avg Rating
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>
              {Number(avgRating).toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
