import * as React from "react";
import FreeEbookCarousel from "./FreeEbookCarousel";
import GenresEbook from "./GenresEbook";
import TopRatedEbooksCarousel from "./TopRatedEbooksCarousel";

const HomePage = () => {
  return (
    <>
      <FreeEbookCarousel />
      <GenresEbook />
      <TopRatedEbooksCarousel />
    </>
  );
};

export default HomePage;
