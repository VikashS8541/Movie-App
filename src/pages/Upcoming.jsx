import React, { useEffect, useState } from "react";
import MovieGrid from "../components/MovieGrid";
import { fetchUpcomingPosts } from "../utility/useMovies";

const Upcoming = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setData((await fetchUpcomingPosts()) || []);
      } catch (err) {
        setError(err?.message || "Failed to load upcoming movies.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="text-white text-center py-20">Loading upcoming movies...</div>;
  }

  if (error) {
    return <div className="text-white text-center py-20">{error}</div>;
  }

  return (
    <section className="upcoming-list relative padding-top">
      <div className="container">
        <h1 className="text-3xl md:text-5xl mb-10 md:mb-20 font-semibold">Upcoming</h1>
        {data.length === 0 ? (
          <div className="text-white text-center py-20">No upcoming movies found.</div>
        ) : (
          <MovieGrid title="upcoming" linkShare="/upcoming" data={data} />
        )}
      </div>
    </section>
  );
};

export default Upcoming;
