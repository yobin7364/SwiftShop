import React, { useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
  Skeleton,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getGenresAction } from "../../../../action/BookAction";
import { useNavigate } from "react-router-dom";

const GenresEbook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    genreDetail: { genres = [] } = {},
    loadingGenres: isLoading,
    errorGenres: error,
  } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(getGenresAction());
  }, [dispatch]);

  // Skeleton cards while loading
  const renderSkeletonCards = (count = 6) =>
    Array.from({ length: count }).map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Skeleton variant="rectangular" height={180} />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" />
          </Box>
        </Card>
      </Grid>
    ));

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Browse Genres
      </Typography>

      {error && <Alert severity="error">Error: {error}</Alert>}

      <Grid container spacing={3}>
        {isLoading ? (
          renderSkeletonCards()
        ) : genres.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            No genres available.
          </Typography>
        ) : (
          genres.map((eachGenre, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
                onClick={() => navigate(`/genreBooksPage/${eachGenre.slug}`)}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="180"
                    image={eachGenre.image}
                    alt={eachGenre.slug}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      width: "100%",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                      color: "white",
                      p: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold">
                      {eachGenre.name}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default GenresEbook;
