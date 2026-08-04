import React, { useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import AdvanceFilterForm from "../components/AdvanceFilterForm";
import { fetchTrendingPosts, fetchMovieGenres } from "../utility/useMovies";
import { fetchFilteredMedia } from "../utility/advanceFilter";

const Trends = () => {
  const [trendData, setTrendData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTrends = async () => {
      setLoading(true);
      setError(null);

      try {
        const [trends, movieGenres] = await Promise.all([
          fetchTrendingPosts(),
          fetchMovieGenres(),
        ]);
        setTrendData(trends || []);
        setFilteredData(trends || []);
        setGenres(movieGenres || []);
      } catch (err) {
        setError(err?.message || "Failed to load trends.");
      } finally {
        setLoading(false);
      }
    };

    loadTrends();
  }, []);

  const handleFilter = useCallback(async (filters) => {
    setFiltering(true);
    setError(null);

    try {
      const results = await fetchFilteredMedia({
        filters,
        genres,
        mediaType: "movie",
        fallbackData: trendData,
      });
      setFilteredData(results);
    } catch (err) {
      setError(err?.message || "Failed to filter trends.");
    } finally {
      setFiltering(false);
    }
  }, [genres, trendData]);

  if (loading) {
    return <div className="text-white text-center py-20">Loading trends...</div>;
  }

  if (error && !trendData.length) {
    return <div className="text-white text-center py-20">{error}</div>;
  }

  return (
    <section className="trends-list relative padding-top">
      <div className="container">
        <h1 className="text-5xl mb-20 font-semibold">Trends</h1>
        <AdvanceFilterForm
          mediaType="movie"
          onFilter={handleFilter}
          isFiltering={filtering}
        />
        {error ? <p className="text-red-400 text-center mb-6">{error}</p> : null}
        {filteredData.length === 0 ? (
          <div className="text-white text-center py-20">No trends found for selected filters.</div>
        ) : (
          <MovieGrid title="trends" linkShare="/trends" data={filteredData} />
        )}
      </div>
    </section>
  );
};

export default Trends;
