import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

export default function SellerSummaryCards() {
  return (
    <Grid container spacing={3} sx={{ ml: 0 }}>
      <Grid item xs={12} sm={6} md={3} sx={{ pl: 0 }}>
        <Card
          sx={{
            bgcolor: "#b2ebf2",
            boxShadow: 3,
            borderRadius: 2,
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              // color="text.secondary"
              align="center"
            >
              Total Books
            </Typography>
            <Typography variant="h4" fontWeight="bold" align="center" mt={1}>
              12
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Second Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "#ffcc80",
            boxShadow: 3,
            borderRadius: 2,
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" align="center">
              Total Sales
            </Typography>
            <Typography variant="h4" fontWeight="bold" align="center" mt={1}>
              230
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Third Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "#a5d6a7",
            boxShadow: 3,
            borderRadius: 2,
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" align="center">
              Revenue
            </Typography>
            <Typography variant="h4" fontWeight="bold" align="center" mt={1}>
              $4,500
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Fourth Card */}
      <Grid item xs={12} sm={6} md={3}>
        <Card
          sx={{
            bgcolor: "#b39ddb",
            boxShadow: 3,
            borderRadius: 2,
            height: 180,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CardContent>
            <Typography variant="h6" fontWeight="bold" align="center">
              Avg Rating
            </Typography>
            <Typography variant="h4" fontWeight="bold" align="center" mt={1}>
              4.6
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
