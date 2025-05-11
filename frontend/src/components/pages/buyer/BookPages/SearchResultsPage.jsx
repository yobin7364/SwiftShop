import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Pagination,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { searchBooksAction } from "../../../../action/BookAction"; // your thunk

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    searchBooks,
    loadingSearch: isLoading,
    errorSearch: error,
  } = useSelector((state) => state.books);

  const totalPages = Math.ceil((searchBooks?.totalBooks || 0) / 10);

  useEffect(() => {
    if (query) {
      dispatch(searchBooksAction({ query, page }));
    }
  }, [dispatch, query, page]);

  const handlePageChange = (_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" }); // optional
  };

  const renderSkeletonCards = () =>
    Array.from({ length: 6 }).map((_, i) => (
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

  const renderBooks = () =>
    searchBooks?.books?.map((book) => (
      <Grid item xs={12} sm={6} md={4} key={book._id}>
        <Card
          onClick={() => navigate(`/bookDetail/${book._id}`)}
          sx={{
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { boxShadow: 4 },
          }}
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
            <Typography variant="body2" color="text.secondary">
              {book.authorDetails?.name || "Unknown"}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              ${book.price}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, pt: 8, pb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Search results for "{query}"
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {isLoading ? (
          renderSkeletonCards()
        ) : searchBooks?.books?.length ? (
          renderBooks()
        ) : (
          <Typography>No books found.</Typography>
        )}
      </Grid>

      {searchBooks?.totalBooks > 10 && (
        <Box mt={4} display="flex" justifyContent="center">
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

export default SearchResultsPage;
