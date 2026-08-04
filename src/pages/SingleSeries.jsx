import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SingleMovieBanner from "../components/slider/SingleMovieBanner";
import CharacterSlider from "../components/slider/CharacterSlider";
import SuggestionMovie from "../components/SuggestionMovie";
import GeneresCategories from "../components/GeneresCategories";
import { fetchSeriesDetails } from "../utility/useMovies";
import PageLoader from "../components/PageLoader";

const SingleSeries = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSeries = async () => {
      setLoading(true);
      setError(null);
      try {
        const detail = await fetchSeriesDetails(id);
        setItem(detail);
      } catch (err) {
        setError(err.message || "Failed to load series details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadSeries();
    }
  }, [id]);
  if (loading) return <PageLoader />;
  if (error) return <div className="text-white text-center py-20">{error}</div>;

  return (
    <>
      <SingleMovieBanner type="tv" item={item} isLoading={loading} error={error} />
      <GeneresCategories genres={item?.genres} />
      <CharacterSlider item={item} />
      <SuggestionMovie item={item} type="tv" />
    </>
  );
};

export default SingleSeries;
