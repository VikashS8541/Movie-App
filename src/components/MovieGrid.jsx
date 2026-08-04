import React, { useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactPaginatePkg from "react-paginate";

const ReactPaginate = ReactPaginatePkg.default || ReactPaginatePkg;
import useMovieData from "../context/useMovieData";
import { IMAGE_BASE_URL } from "../utility/useMovies";

const ITEMS_PER_PAGE = 15;

const MovieGrid = ({ linkShare = "/", title, data = [] }) => {
  const { savedCollectionMovies, toggleCollectionMovie } = useMovieData();
  const [currentPage, setCurrentPage] = useState(0);
  const base = (linkShare || "").replace(/\/$/, "");
  const movies = Array.isArray(data) ? data : [];
  const savedIds = savedCollectionMovies.map((movie) => movie.id);

  useEffect(() => {
    setCurrentPage(0);
  }, [data]);

  const pageCount = Math.ceil(movies.length / ITEMS_PER_PAGE);

  const currentMovies = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return movies.slice(start, start + ITEMS_PER_PAGE);
  }, [movies, currentPage]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="movie-grid-main py-16 min-h-screen">
      <div className="movie-grid-inner">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {currentMovies.map((movie) => {
            const imageSrc =
              movie.image ||
              (movie.poster_path
                ? `${IMAGE_BASE_URL}${movie.poster_path}`
                : movie.backdrop_path
                ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
                : "");
            const movieTitle =
              movie.title ||
              movie.name ||
              movie.original_title ||
              movie.original_name ||
              "movie";

            return (
              <div
                key={movie.id}
                className="relative rounded-2xl overflow-hidden group cursor-pointer"
              >
                <div className="relative image-box">
                  <Link to={`${base}/${movie.id}`}>
                    <img
                      loading="lazy"
                      decoding="async"
                      src={imageSrc}
                      alt={movieTitle}
                      className="w-full h-[380px] object-cover rounded-2xl transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="absolute z-0 inset-0 bg-black/15 pointer-events-none"></div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleCollectionMovie(movie)}
                  className={`absolute top-2 left-2 w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center text-lg border border-white/10 transition ${
                    savedIds.includes(movie.id)
                      ? "bg-blue-500 text-white"
                      : "bg-black/70 text-white"
                  }`}
                >
                  <FaPlus />
                </button>
              </div>
            );
          })}
        </div>

        {pageCount > 1 ? (
          <ReactPaginate
            breakLabel="..."
            nextLabel="Next ›"
            previousLabel="‹ Prev"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            forcePage={currentPage}
            containerClassName="movie-pagination flex items-center justify-center gap-2 flex-wrap mt-12"
            pageClassName="movie-pagination-item"
            pageLinkClassName="movie-pagination-link"
            previousClassName="movie-pagination-item"
            previousLinkClassName="movie-pagination-link"
            nextClassName="movie-pagination-item"
            nextLinkClassName="movie-pagination-link"
            breakClassName="movie-pagination-item"
            breakLinkClassName="movie-pagination-link"
            activeClassName="active"
            disabledClassName="disabled"
          />
        ) : null}
      </div>
    </section>
  );
};

export default MovieGrid;
