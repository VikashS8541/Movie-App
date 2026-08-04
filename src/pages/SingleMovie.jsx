import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleMovieBanner from "../components/slider/SingleMovieBanner";
import CharacterSlider from "../components/slider/CharacterSlider";
import SuggestionMovie from "../components/SuggestionMovie";
import GeneresCategories from "../components/GeneresCategories";
import { fetchMovieDetails } from "../utility/useMovies";
import PageLoader from "../components/PageLoader";

const SingleMovie = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchMovieDetails(id);
        setItem(detail);
      } catch (err) {
        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMovie();
    }
  }, [id]);
  if (loading) return <PageLoader />;
  if (error) return <div className="text-white text-center py-20">{error}</div>;

  return (
    <>
      <SingleMovieBanner type="movie" item={item} isLoading={loading} error={error} />
      <GeneresCategories genres={item?.genres} />
      <CharacterSlider item={item} />
      <SuggestionMovie item={item} type="movie" />
    </>
  );
};

export default SingleMovie;
