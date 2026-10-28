import React, { useCallback, useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import AdvanceFilterForm from "../components/AdvanceFilterForm";
import { fetchTvPosts, fetchSeriesGenres } from "../utility/useMovies";
import { fetchFilteredMedia } from "../utility/advanceFilter";

const Series = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      setError(null);

      try {
        const [series, tvGenres] = await Promise.all([
          fetchTvPosts(),
          fetchSeriesGenres(),
        ]);
        setSeriesData(series || []);
        setFilteredData(series || []);
        setGenres(tvGenres || []);
      } catch (err) {
        setError(err?.message || "Failed to load series.");
      } finally {
        setLoading(false);
      }
    };

    loadSeries();
  }, []);

  const handleFilter = useCallback(async (filters) => {
    setFiltering(true);
    setError(null);

    try {
      const results = await fetchFilteredMedia({
        filters,
        genres,
        mediaType: "tv",
        fallbackData: seriesData,
      });
      setFilteredData(results);
    } catch (err) {
      setError(err?.message || "Failed to filter series.");
    } finally {
      setFiltering(false);
    }
  }, [genres, seriesData]);

  if (loading) {
    return <div className="text-white text-center py-20">Loading series...</div>;
  }

  if (error && !seriesData.length) {
    return <div className="text-white text-center py-20">{error}</div>;
  }

  return (
    <section className="series-list relative padding-top">
      <div className="container">
        <h1 className="text-3xl md:text-5xl mb-10 md:mb-20 font-semibold">Series</h1>
        <AdvanceFilterForm
          mediaType="tv"
          onFilter={handleFilter}
          isFiltering={filtering}
        />
        {error ? <p className="text-red-400 text-center mb-6">{error}</p> : null}
        {filteredData.length === 0 ? (
          <div className="text-white text-center py-20">No series found for selected filters.</div>
        ) : (
          <MovieGrid title="series" linkShare="/series" data={filteredData} />
        )}
      </div>
    </section>
  );
};

export default Series;
