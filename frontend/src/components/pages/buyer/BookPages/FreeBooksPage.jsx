import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { freeBookAction } from "../../../../action/BookAction";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Grid,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const FreeBooksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    freeBooks,
    loadingFreeBooks: isLoading,
    errorFreeBooks: error,
  } = useSelector((state) => state.books);

  const totalPages = Math.ceil((freeBooks?.total || 0) / limit);

  useEffect(() => {
    dispatch(freeBookAction({ page, limit }));
  }, [dispatch, page]);

  const handlePageChange = (_, value) => {
    setPage(value);
  };

  const renderSkeletonCards = (count = 6) =>
    Array.from({ length: count }).map((_, i) => (
      <Grid item xs={12} sm={6} md={4} key={i}>
        <Card>
          <Skeleton variant="rectangular" height={250} />
          <CardContent>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Grid>
    ));

  const renderBookCards = () =>
    freeBooks?.books?.map((book, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card
          sx={{
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { boxShadow: 4 },
          }}
          onClick={() => navigate(`/bookDetail/${book._id}`)}
        >
          <img
            src={book.coverImage}
            alt={book.title}
            style={{ width: "100%", height: "250px", objectFit: "cover" }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              {book.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {book.author.name}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              Free
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        paddingTop: 6,
        px: 2,
        paddingBottom: 6,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Free eBooks
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {isLoading ? (
          renderSkeletonCards()
        ) : freeBooks?.books?.length ? (
          renderBookCards()
        ) : (
          <Typography>No free books found.</Typography>
        )}
      </Grid>

      {freeBooks?.total > limit && (
        <Box display="flex" justifyContent="center" mt={5}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default FreeBooksPage;
