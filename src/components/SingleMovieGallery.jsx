import React from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import useMovieData from "../context/useMovieData";
import { IMAGE_BASE_URL } from "../utility/useMovies";

const SingleMovieGallery = ({ movies = [] }) => {
  const { savedCollectionMovies, toggleCollectionMovie } = useMovieData();
  const galleryMovies = Array.isArray(movies) ? movies : [];
  const savedIds = savedCollectionMovies.map((item) => item.id);

  return (
    <section className="w-full py-10 relative single-movie-gallery">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 md:gap-8">
          {galleryMovies.map((movie) => {
            const imageSrc =
              movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : movie.backdrop_path
                ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
                : movie.image || "";
            const movieTitle = movie.title || movie.name || movie.original_title || movie.original_name || "Movie";

            return (
              <div
                key={movie.id}
                className="relative group w-full sm:w-[calc(50%-1rem)] lg:w-[400px] max-w-[400px] h-[420px] md:h-[500px] rounded-3xl overflow-hidden"
              >
                <Link to={`/movies/${movie.id}`} className="block w-full h-full">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={imageSrc}
                    alt={movieTitle}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </Link>

                <div className="absolute inset-0 bg-black/20 pointer-events-none z-10" />

                <div className="absolute top-4 left-4 z-30">
                  <button
                    type="button"
                    onClick={() => toggleCollectionMovie(movie)}
                    className={`w-14 h-14 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center text-xl transition ${
                      savedIds.includes(movie.id) ? "bg-blue-500 text-white" : "bg-white/10 text-white"
                    }`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SingleMovieGallery;
