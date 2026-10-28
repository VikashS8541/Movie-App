import React, { useState, useEffect } from "react";
import useMovieData from "../../context/useMovieData";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";

import "./Slider.css";

import { Navigation, Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

const SliderBanner = ({ buttonNav = [], slides = [] }) => {
  const { heroMovies: moviesImage } = useMovieData();
  const slideData = slides?.length ? slides : moviesImage;
  const [activeMovie, setActiveMovie] = useState(slideData?.[0] || null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    setActiveMovie(slideData?.[0] || null);
  }, [slideData]);

  if (!slideData?.length) {
    return null;
  }

  const imageBase = "https://image.tmdb.org/t/p/original";
  const posterBase = "https://image.tmdb.org/t/p/w500";

  const title = activeMovie?.title || activeMovie?.name || activeMovie?.original_title || activeMovie?.original_name || "Untitled";
  const description = activeMovie?.overview || activeMovie?.description || activeMovie?.tagline || "";
  const rating = activeMovie?.vote_average ? activeMovie.vote_average.toFixed(1) : activeMovie?.rating || "";
  const platform = activeMovie?.platform || activeMovie?.network?.name || "TMDB";
  const backgroundImage =
    activeMovie?.backdrop_path
      ? `${imageBase}${activeMovie.backdrop_path}`
      : activeMovie?.poster_path
      ? `${posterBase}${activeMovie.poster_path}`
      : activeMovie?.image || "";

  const handleThumbnailClick = (movie, index) => {
    setActiveMovie(movie);
    swiperInstance?.slideToLoop(index);
  };

  const renderStars = (rating) => {
    if (!rating) return "★ ★ ★ ★ ★";
    const numStars = Math.round(rating / 2);
    const fullStars = Math.floor(numStars);
    const hasHalfStar = numStars % 1 !== 0;
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += "★ ";
      } else if (i === fullStars && hasHalfStar) {
        stars += "★ ";
      } else {
        stars += "☆ ";
      }
    }
    return stars.trim();
  };

  return (
    <section className="slider-banner relative w-full h-screen overflow-hidden">
      <div className="relative w-full h-full">
        {/* Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-[#030A1B]/80"></div>

        {/* Content Container */}
        <div className="h-full slider-content-box relative z-10">
          <div className="container h-full">
            <div className="content-inner-box h-[90%] pt-24 flex flex-col lg:flex-row items-start lg:items-end justify-end lg:justify-between gap-6">
              {/* Left Content */}
              <div className="max-w-xl w-full text-white content-banner-box">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 md:mb-5 line-clamp-2">{title}</h1>
                <p className="text-gray-300 leading-7 mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">{description}</p>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 md:mb-8">
                  <span className="text-yellow-400 text-lg">{renderStars(rating)}</span>
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded font-bold">IMDb</span>
                  <span>{rating}/10</span>
                  <span className="text-red-500 font-semibold">{platform}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 md:gap-4">
                  {buttonNav && buttonNav.length > 0 &&
                    buttonNav.map((item) => (
                      <Link key={item?.id} to={item?.path} className={item?.className}>
                        {item?.text}
                      </Link>
                    ))}
                </div>
              </div>

              {/* Right Thumbnail Slider */}
              <div className="w-full max-w-[500px] thumbnail-slider">
                <Swiper
                  slidesPerView={3}
                  centeredSlides={true}
                  centerInsufficientSlides={true}
                  slideToClickedSlide={true}
                  spaceBetween={16}
                  navigation={true}
                  loop={true}
                  speed={700}
                  resistanceRatio={0.85}
                  watchSlidesProgress={true}
                  modules={[Navigation]}
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => {
                    const nextMovie = slideData[swiper.realIndex];
                    if (nextMovie) {
                      setActiveMovie(nextMovie);
                    }
                  }}
                >
                  {slideData.map((movie, index) => {
                    const thumbImage = movie.poster_path
                      ? `${posterBase}${movie.poster_path}`
                      : movie.backdrop_path
                      ? `${posterBase}${movie.backdrop_path}`
                      : movie.image || "";
                    const isActive = activeMovie?.id === movie.id;

                    return (
                      <SwiperSlide key={movie.id || index}>
                        <button
                          type="button"
                          onClick={() => handleThumbnailClick(movie, index)}
                          className={`w-full h-[120px] md:h-[200px] rounded-2xl overflow-hidden transition-transform duration-500 ease-out ${
                            isActive
                              ? "scale-105 opacity-100"
                              : "scale-95 opacity-60 hover:opacity-90"
                          }`}
                        >
                          <img
                            src={thumbImage}
                            alt="Movie thumbnail"
                             loading="lazy"
                             decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SliderBanner;
