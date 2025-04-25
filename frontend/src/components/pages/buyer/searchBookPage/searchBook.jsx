import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Pagination,
} from "@mui/material";

const ebooks = [
  {
    title: "Buchanan's Express",
    image:
      "https://plus.unsplash.com/premium_photo-1682125773446-259ce64f9dd7?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Blackstone",
    image:
      "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Gitel’s Freedom",
    image:
      "https://images.unsplash.com/photo-1641154748135-8032a61a3f80?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Ice Age",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "The Fondling of Details",
    image:
      "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?q=80&w=1980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Granny Goes to Egypt",
    image:
      "https://images.unsplash.com/photo-1511108690759-009324a90311?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const ITEMS_PER_PAGE = 4;

export default function BuyerBooks() {
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const paginatedEbooks = ebooks.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: "1200px",
        minWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Search Results
      </Typography>

      <Grid container spacing={3}>
        {paginatedEbooks.map((ebook, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ cursor: "pointer" }}>
              <CardMedia
                component="img"
                height="200"
                image={ebook.image}
                alt={ebook.title}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {ebook.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Pagination
        count={Math.ceil(ebooks.length / ITEMS_PER_PAGE)}
        page={page}
        onChange={handleChange}
        sx={{ marginTop: 3, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
}
