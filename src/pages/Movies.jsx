import React, { useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import AdvanceFilterForm from "../components/AdvanceFilterForm";
import { fetchPopularPosts, fetchMovieGenres } from "../utility/useMovies";
import { fetchFilteredMedia } from "../utility/advanceFilter";

const Movies = () => {
  const [movieData, setMovieData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const [movies, movieGenres] = await Promise.all([
          fetchPopularPosts(),
          fetchMovieGenres(),
        ]);
        setMovieData(movies || []);
        setFilteredData(movies || []);
        setGenres(movieGenres || []);
      } catch (err) {
        setError(err?.message || "Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleFilter = useCallback(async (filters) => {
    setFiltering(true);
    setError(null);

    try {
      const results = await fetchFilteredMedia({
        filters,
        genres,
        mediaType: "movie",
        fallbackData: movieData,
      });
      setFilteredData(results);
    } catch (err) {
      setError(err?.message || "Failed to filter movies.");
    } finally {
      setFiltering(false);
    }
  }, [genres, movieData]);

  if (loading) {
    return <div className="text-white text-center py-20">Loading movies...</div>;
  }

  if (error && !movieData.length) {
    return <div className="text-white text-center py-20">{error}</div>;
  }

  return (
    <section className="movies-list relative padding-top">
      <div className="container">
        <h1 className="text-3xl md:text-5xl mb-10 md:mb-20 font-semibold">Movies</h1>
        <AdvanceFilterForm
          mediaType="movie"
          onFilter={handleFilter}
          isFiltering={filtering}
        />
        {error ? <p className="text-red-400 text-center mb-6">{error}</p> : null}
        {filteredData.length === 0 ? (
          <div className="text-white text-center py-20">No movies found for selected filters.</div>
        ) : (
          <MovieGrid title="movies" linkShare="/movies" data={filteredData} />
        )}
      </div>
    </section>
  );
};

export default Movies;
