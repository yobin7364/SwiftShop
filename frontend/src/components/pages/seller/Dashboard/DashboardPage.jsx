import React, { useState } from "react";
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
  Button,
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

import SellerSummaryCards from "./SellerSummaryCards";

const drawerWidth = 240;

const data = [
  { month: "Jan", sales: 10, revenue: 200 },
  { month: "Feb", sales: 15, revenue: 300 },
  { month: "Mar", sales: 8, revenue: 160 },
  { month: "Apr", sales: 8, revenue: 190 },
  { month: "May", sales: 11, revenue: 110 },
  { month: "Jun", sales: 15, revenue: 100 },
];

const topBooks = [
  { id: 1, title: "Ice Age", sales: 120, rating: 4.8 },
  { id: 2, title: "Freedom", sales: 80, rating: 4.5 },
];

const recentReviews = [
  { id: 1, bookTitle: "Ice Age", text: "Amazing story!", rating: 5 },
  { id: 2, bookTitle: "Freedom", text: "Loved it!", rating: 4 },
];

export default function SellerDashboard() {
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
            {/* Cards */}

            <SellerSummaryCards />

            {/* Charts */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Sales Overview
                </Typography>
                <LineChart width={500} height={300} data={data}>
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
                <BarChart width={500} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </Paper>
            </Grid>

            {/* Tables */}
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
                      {topBooks.map((book) => (
                        <TableRow key={book.id}>
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
                      {recentReviews.map((review) => (
                        <TableRow key={review.id}>
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
