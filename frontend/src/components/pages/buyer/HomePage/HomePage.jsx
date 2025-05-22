import * as React from "react";
import FreeEbookCarousel from "./FreeEbookCarousel";
import GenresEbook from "./GenresEbook";
import TopRatedEbooksCarousel from "./TopRatedEbooksCarousel";
import NewlyAddedBooksCarousel from "./NewlyAddedBooksCarousel";

const HomePage = () => {
  return (
    <>
      <FreeEbookCarousel />
      <GenresEbook />
      <TopRatedEbooksCarousel />
      <NewlyAddedBooksCarousel />
    </>
  );
};

export default HomePage;
