import React from "react";
import SliderBanner from "../components/slider/SliderBanner";
import CollectionSlider from "../components/slider/CollectionSlider";
import useMovieData from "../context/useMovieData";

const Collection = () => {
  const { savedCollectionMovies } = useMovieData();

  const buttonNav = [
    {
      id: 1,
      text: "Watch Collection",
      path: "/",
      className: "blue-btn",
    },
    {
      id: 2,
      text: "More Info",
      path: "/",
      className: "outline-btn",
    },
  ];

  const bannerSlides = savedCollectionMovies.slice(0, 5);

  return (
    <section className="collection-list relative">
      {bannerSlides.length > 0 && <SliderBanner buttonNav={buttonNav} slides={bannerSlides} />}

      {savedCollectionMovies.length === 0 ? (
        <div className="text-white text-center py-20 padding-top">
          No items saved to your collection yet. Click the + icon or wishlist button to save a movie or series.
        </div>
      ) : (
        <CollectionSlider title="My Collection" linkShare="/collection" collectionsData={savedCollectionMovies} />
      )}
    </section>
  );
};

export default Collection;
