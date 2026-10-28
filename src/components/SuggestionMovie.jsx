import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { FaPlus } from "react-icons/fa";
import "swiper/css";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import useMovieData from "../context/useMovieData";
import { fetchMovieSimilar, fetchSeriesSimilar, IMAGE_BASE_URL } from "../utility/useMovies";

const SuggestionMovie = ({ item, type = "movie" }) => {
  const { savedCollectionMovies, toggleCollectionMovie } = useMovieData();
  const savedIds = savedCollectionMovies.map((saved) => saved.id);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item?.id) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data =
          type === "tv"
            ? await fetchSeriesSimilar(item.id)
            : await fetchMovieSimilar(item.id);
        setSuggestions(data || []);
      } catch (err) {
        setError(err.message || "Failed to load suggestions");
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [item, type]);

  const currentSuggestions = suggestions;
  const title = item?.title || item?.name || "this movie";
  const routePrefix = type === "tv" ? "series" : type === "trends" ? "trends" : "movies";

  return (
    <section className="w-full mt-10 suggestion-movie-banner relative">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-white text-2xl md:text-5xl font-bold">
            Suggestion Like “{title}”
          </h2>
        </div>
      </div>

      <div className="ml-4 md:ml-8 swipper-wrapper-box">
        {loading ? (
          <p className="text-white ml-4 md:ml-8">Loading suggestions...</p>
        ) : error ? (
          <p className="text-white ml-4 md:ml-8">{error}</p>
        ) : currentSuggestions.length === 0 ? (
          <p className="text-white ml-4 md:ml-8">No suggestions available.</p>
        ) : (
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={22}
            slidesPerView={1.3}
            breakpoints={{
              480: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5.5,
              },
            }}
            className="movieSwiper"
          >
            {currentSuggestions.map((movie) => {
              const movieTitle = movie.title || movie.name || movie.original_title || movie.original_name || "Movie";
              const imageSrc =
                movie.image || (movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : "");

              return (
                <SwiperSlide key={movie.id}>
                  <div className="relative group overflow-hidden rounded-[28px] cursor-pointer">
                    <Link to={`/${routePrefix}/${movie.id}`}>
                      <img
                        src={imageSrc}
                        alt={movieTitle}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-[300px] md:h-[350px] object-cover rounded-[28px] transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="absolute pointer-events-none inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    <button
                      type="button"
                      onClick={() => toggleCollectionMovie(movie)}
                      className={`absolute top-5 left-5 w-12 h-12 rounded-2xl backdrop-blur-md flex items-center justify-center text-white text-xl border border-white/10 ${
                        savedIds.includes(movie.id) ? "bg-blue-500" : "bg-black/40"
                      }`}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default SuggestionMovie;
