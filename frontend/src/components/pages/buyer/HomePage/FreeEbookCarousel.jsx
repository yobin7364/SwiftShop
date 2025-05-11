import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { freeBookAction } from "../../../../action/BookAction";
import Slider from "react-slick";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Skeleton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Arrow Components
const NextArrow = ({ onClick, isDisabled }) => (
  <ArrowForwardIos
    onClick={onClick}
    sx={{
      position: "absolute",
      right: -55,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: isDisabled ? "not-allowed" : "pointer",
      fontSize: "2rem",
      color: isDisabled ? "#ccc" : "#69a69e",
      visibility: isDisabled ? "hidden" : "visible",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "5px",
      zIndex: 1,
    }}
  />
);

const PrevArrow = ({ onClick, isDisabled }) => (
  <ArrowBackIos
    onClick={onClick}
    sx={{
      position: "absolute",
      left: -55,
      top: "50%",
      transform: "translateY(-50%)",
      cursor: isDisabled ? "not-allowed" : "pointer",
      fontSize: "2rem",
      color: isDisabled ? "#ccc" : "#69a69e",
      visibility: isDisabled ? "hidden" : "visible",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "5px",
      zIndex: 1,
    }}
  />
);

// Main Component
const FreeEbookCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    freeBooks: { books = [], total = 0 } = {}, // Destructure nested safely
    loadingFreeBooks: isLoading,
    errorFreeBooks: error,
  } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(freeBookAction({ limit: 10, page: 1 }));
  }, [dispatch]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (current) => setCurrentSlide(current),
    nextArrow: <NextArrow isDisabled={currentSlide >= books.length - 5} />,
    prevArrow: <PrevArrow isDisabled={currentSlide === 0} />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 4 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  const renderSkeletonCards = (count = 5) => {
    return Array.from({ length: count }).map((_, index) => (
      <Box key={index} sx={{ pr: 1 }}>
        <Card sx={{ margin: "0 10px", textAlign: "center" }}>
          <Skeleton variant="rectangular" width="100%" height={250} />
          <CardContent>
            <Skeleton variant="text" width="80%" height={25} />
            <Skeleton variant="text" width="60%" height={20} />
          </CardContent>
        </Card>
      </Box>
    ));
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        minWidth: "800px",
        margin: "auto",
        paddingTop: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          FREE EBOOKS
        </Typography>
        <Link
          onClick={() => navigate("/freeBooksPage")}
          sx={{
            color: "#008000",
            fontSize: "14px",
            fontWeight: "bold",
            textDecoration: "none",
            cursor: "pointer",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          (view all)
        </Link>
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      <Slider {...settings}>
        {isLoading
          ? renderSkeletonCards(5)
          : total === 0
          ? [
              <Typography key="empty" sx={{ p: 3 }}>
                No free books available.
              </Typography>,
            ]
          : books?.map((book, index) => (
              <Box key={index} sx={{ pr: 1 }}>
                <Card
                  sx={{
                    margin: "0 10px",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { boxShadow: 4 },
                  }}
                  onClick={() => navigate(`/bookDetail/${book._id}`)}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                    }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
              </Box>
            ))}
      </Slider>
    </Box>
  );
};

export default FreeEbookCarousel;
