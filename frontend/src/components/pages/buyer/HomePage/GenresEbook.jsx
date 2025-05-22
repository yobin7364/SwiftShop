import React from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Cartoon-style genre list
const genreList = [
  {
    name: "Action",
    slug: "action",
    image:
      "https://img.freepik.com/free-vector/superhero-comic-style-illustration_23-2148975014.jpg", // Cartoon action
  },
  {
    name: "Adventure",
    slug: "adventure",
    image:
      "https://img.freepik.com/free-vector/cartoon-adventure-background-with-map-elements_23-2148999783.jpg", // Adventure map
  },
  {
    name: "Mystery",
    slug: "mystery",
    image:
      "https://img.freepik.com/free-vector/comic-style-mystery-background_23-2148994460.jpg", // Mystery comic
  },
  {
    name: "Science Fiction",
    slug: "science-fiction",
    image:
      "https://img.freepik.com/free-vector/science-fiction-cartoon-background_23-2148961577.jpg", // Sci-fi cartoon
  },
  {
    name: "Romance",
    slug: "romance",
    image:
      "https://img.freepik.com/free-vector/romantic-couple-cartoon-illustration_23-2148958132.jpg", // Romance cartoon
  },
  {
    name: "Thriller",
    slug: "thriller",
    image:
      "https://img.freepik.com/free-vector/thriller-movie-poster-with-silhouette_23-2148667094.jpg", // Thriller dark
  },
  {
    name: "Horror",
    slug: "horror",
    image:
      "https://img.freepik.com/free-vector/horror-movie-background-with-haunted-house_23-2148658203.jpg", // Horror haunted
  },
  {
    name: "Health",
    slug: "health",
    image:
      "https://img.freepik.com/free-vector/healthy-lifestyle-cartoon-illustration_23-2148552951.jpg", // Cartoon health
  },
];

const GenresEbook = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Browse Genres
      </Typography>

      <Grid container spacing={3}>
        {genreList.map((genre, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                position: "relative",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 3,
              }}
              onClick={() => navigate(`/genreBooksPage/${genre.slug}`)}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="180"
                  image={genre.image}
                  alt={genre.slug}
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
                    {genre.name}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GenresEbook;
