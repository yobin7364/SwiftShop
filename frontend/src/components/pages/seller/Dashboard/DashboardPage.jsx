import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { dashboardDataAction } from "../../../../action/dashboardAction";
import SellerSummaryCards from "./SellerSummaryCards";
import { parse, compareDesc } from "date-fns";

const drawerWidth = 240;

export default function SellerDashboard() {
  const dispatch = useDispatch();
  const { dashboardData, loadingDashboardData, errorDashboardData } =
    useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(dashboardDataAction());
  }, [dispatch]);

  if (loadingDashboardData) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (errorDashboardData) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography color="error">{errorDashboardData}</Typography>
      </Box>
    );
  }

  const salesData = dashboardData.salesOverview || [];
  const revenueData = dashboardData.revenueOverview || [];

  const getLastSixMonths = (data) => {
    const parsed = data.map((item) => ({
      ...item,
      date: parse(item.month, "MMM yyyy", new Date()),
    }));

    const sorted = parsed.sort((a, b) => compareDesc(a.date, b.date));
    return sorted.slice(0, 6).reverse();
  };

  const lastSixSales = getLastSixMonths(salesData);
  const lastSixRevenue = getLastSixMonths(revenueData);

  const combinedData = lastSixSales.map((saleItem) => {
    const revenueItem = lastSixRevenue.find((r) => r.month === saleItem.month);
    return {
      month: saleItem.month.split(" ")[0],
      sales: saleItem.value,
      revenue: revenueItem ? parseFloat(revenueItem.value.toFixed(2)) : 0,
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        margin: "auto",
        minHeight: "100vh",
        flexDirection: "column",
        maxWidth: "1500px",
        minWidth: "800px",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <SellerSummaryCards
              totalBooks={dashboardData.totalBooks}
              totalSales={dashboardData.totalSales}
              totalRevenue={dashboardData.totalRevenue}
              avgRating={dashboardData.avgRating}
            />

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Sales Overview
                </Typography>
                <LineChart width={500} height={300} data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#69a69e" />
                </LineChart>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Revenue Overview
                </Typography>
                <BarChart width={500} height={300} data={combinedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Top Selling Books
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Title</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Sales</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Rating</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.topSellingBooks?.map((book, index) => (
                        <TableRow key={index}>
                          <TableCell>{book.title}</TableCell>
                          <TableCell>{book.sales}</TableCell>
                          <TableCell>{book.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Recent Reviews
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>
                          <strong>Book</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Review</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Rating</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData.recentReviews?.map((review, index) => (
                        <TableRow key={index}>
                          <TableCell>{review.bookTitle}</TableCell>
                          <TableCell>{review.text}</TableCell>
                          <TableCell>{review.rating}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
