import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./Slider.css";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPlay } from "react-icons/fa";
import useMovieData from "../../context/useMovieData";
import { IMAGE_BASE_URL } from "../../utility/useMovies";

const ContinueWatching = ({ title, linksText, linkShare = "" }) => {
  const { continueMovies } = useMovieData();
  return (
    <section className="py-10 relative watching-section">
      <div className="container">
        <div className="flex items-center mb-6 md:mb-10 justify-between w-full title-links relative z-1">
          <h2 className="text-3xl md:text-5xl text-white font-semibold">{title}</h2>
          {linksText.length > 0 && (
            <Link
              to={linkShare}
              className="flex items-center justify-center gap-3 text-blue-500 text-md font-medium"
            >
              {linksText} <FaArrowRight size={"14px"} />
            </Link>
          )}
        </div>
      </div>
      <div className="ml-4 md:ml-8 swipper-wrapper-box">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={25}
          slidesPerView={3}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {continueMovies.map((movie) => {
            const imageSrc =
              movie.image ||
              (movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : movie.backdrop_path
                ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
                : "");
            const movieTitle = movie.title || movie.name || "Untitled";

            return (
              <SwiperSlide key={movie.id}>
                <div className="relative rounded-[24px] overflow-hidden group">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={imageSrc}
                    alt={movieTitle}
                    className="w-full h-[260px] object-cover"
                  />

                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Link to="/" className="w-16 h-16 rounded-full bg-pink-500 text-white flex items-center justify-center text-xl">
                      <FaPlay />
                    </Link>
                  </div>

                  <h3 className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg md:text-2xl font-medium whitespace-nowrap max-w-[90%] truncate">
                    {movieTitle}
                  </h3>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                    <div
                      className="h-full bg-pink-500"
                      style={{ width: `${movie.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ContinueWatching;
