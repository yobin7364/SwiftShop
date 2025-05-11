import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link,
  Skeleton,
  Grid,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { getTopRatedBooksAction } from "../../../../action/BookAction";
import { useNavigate } from "react-router-dom";

// Custom arrow components
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
      color: isDisabled ? "#ccc" : "#69a69e", // Disabled color
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
      color: isDisabled ? "#ccc" : "#69a69e", // Disabled color
      visibility: isDisabled ? "hidden" : "visible",
      backgroundColor: "white",
      borderRadius: "50%",
      padding: "5px",
      zIndex: 1,
    }}
  />
);

const TopRatedEbooksCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const {
    topRatedBooks: { books = [], totalBooks = 0 } = {}, // Destructure nested safely
    loadingTopRatedBooks: isLoading,
    errorTopRatedBooks: error,
  } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(getTopRatedBooksAction({ limit: 10, page: 1 }));
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

  const renderBookCards = () =>
    books?.map((book, index) => {
      const hasDiscount = book.discountActive;
      const discountedPrice = hasDiscount
        ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
        : null;

      return (
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
        </Box>
      );
    });

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
          TOP RATED EBOOKS
        </Typography>
        <Link
          onClick={() => navigate("/topRatedPage")}
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
          : totalBooks === 0
          ? [
              <Typography key="empty" sx={{ p: 3 }}>
                No top rated books available.
              </Typography>,
            ]
          : renderBookCards()}
      </Slider>
    </Box>
  );
};
export default TopRatedEbooksCarousel;
