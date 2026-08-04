import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SingleMovieGallery from "../components/SingleMovieGallery";
import SliderBanner from "../components/slider/SliderBanner";
import { fetchCollectionDetails } from "../utility/useMovies";
import PageLoader from "../components/PageLoader";

const SingleCollection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const loadCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCollectionDetails(id);
        setCollection(data || null);
      } catch (err) {
        setError(err?.message || "Failed to load collection details.");
      } finally {
        setLoading(false);
      }
    };

    loadCollection();
  }, [id]);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return <div className="text-white text-center py-20">{error}</div>;
  }

  if (!collection) {
    return <div className="text-white text-center py-20">Collection not found.</div>;
  }

  return (
    <>
      <SliderBanner
        buttonNav={[
          { id: 1, text: "Back to Collections", path: "/collection", className: "outline-btn" },
          { id: 2, text: "View All Parts", path: "/collection", className: "blue-btn" },
        ]}
        slides={collection.parts || []}
      />

      <section className="collection-detail py-16">
        <div className="container">
          <h1 className="text-5xl font-semibold text-white mb-6">{collection.name}</h1>
          <p className="text-gray-300 leading-8 max-w-3xl">{collection.overview || collection.description || "No description available."}</p>
          <div className="mt-10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-full bg-blue-500 text-white"
            >
              Go Back
            </button>
          </div>
        </div>
      </section>

      <SingleMovieGallery movies={collection.parts || []} />
    </>
  );
};

export default SingleCollection;
