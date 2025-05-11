import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEachGenreBooksAction } from "../../../../action/BookAction";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Pagination,
  Grid,
  Skeleton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const GenreBooksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 6;
  const { genreSlug } = useParams();

  const {
    genreBooks,
    loadingGenreBooks: isLoading,
    errorGenreBooks: error,
  } = useSelector((state) => state.books);

  const totalPages = Math.ceil((genreBooks?.totalBooks || 0) / limit);

  useEffect(() => {
    dispatch(getEachGenreBooksAction({ genreSlug, page, limit }));
  }, [dispatch, page, genreSlug]);

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
    genreBooks?.books?.map((book, index) => {
      const hasDiscount =
        book.discountPercentage > 0 || book.discountPercentage !== null;
      const discountedPrice = hasDiscount
        ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
        : null;

      return (
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
                {book.author?.name}
              </Typography>
              <Typography
                variant="body1"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {hasDiscount ? (
                  <>
                    ${discountedPrice}
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        color: "gray",
                        marginLeft: "8px",
                      }}
                    >
                      ${book.price}
                    </Typography>
                  </>
                ) : (
                  `$${book.price}`
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    });

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
        {genreSlug?.[0]?.toUpperCase() + genreSlug?.slice(1)} Books
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3}>
        {isLoading ? (
          renderSkeletonCards()
        ) : genreBooks?.books?.length ? (
          renderBookCards()
        ) : (
          <Typography>No books found.</Typography>
        )}
      </Grid>

      {genreBooks?.totalBooks > limit && (
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

export default GenreBooksPage;
