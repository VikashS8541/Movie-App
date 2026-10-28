import React, { useEffect, useState } from "react";
import {
  FaPlay,
  FaBookmark,

} from "react-icons/fa";
import { BsChatDotsFill } from "react-icons/bs";
import { Link, useParams, useLocation } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchSeriesDetails,
  fetchCollectionDetails,
} from "../../utility/useMovies";
import useMovieData from "../../context/useMovieData";

const SingleMovieBanner = ({ type: propType = null, item: parentItem, isLoading = false, error: parentError = null, isUpcoming = false }) => {
  const renderStars = (rating) => {
    if (!rating) return "★ ★ ★ ★ ★";
    const numStars = Math.round(rating / 2);
    const fullStars = Math.floor(numStars);
    const hasHalfStar = numStars % 1 !== 0;
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += "★ ";
      } else if (i === fullStars && hasHalfStar) {
        stars += "★ ";
      } else {
        stars += "☆ ";
      }
    }
    return stars.trim();
  };
  const { id } = useParams();
  const location = useLocation();
  const [internalItem, setInternalItem] = useState(null);
  const [internalLoading, setInternalLoading] = useState(true);
  const [internalError, setInternalError] = useState(null);

  const getTypeFromPath = () => {
    if (propType) {
      if (propType === "series" || propType === "tv") return "tv";
      return "movie";
    }
    const path = location.pathname.split("/")[1];
    if (path === "series") return "tv";
    return "movie";
  };

  const itemType = getTypeFromPath();
  const { savedCollectionMovies, toggleCollectionMovie } = useMovieData();
  const item = parentItem !== undefined ? parentItem : internalItem;
  const loading = parentItem !== undefined ? isLoading : internalLoading;
  const error = parentItem !== undefined ? parentError : internalError;
  const isSaved = item?.id && savedCollectionMovies.some((movie) => movie.id === item.id);

  const [collectionData, setCollectionData] = useState(null);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [collectionError, setCollectionError] = useState(null);

  useEffect(() => {
    const loadCollection = async () => {
      if (!item?.belongs_to_collection?.id) {
        setCollectionData(null);
        setCollectionError(null);
        setCollectionLoading(false);
        return;
      }

      setCollectionLoading(true);
      setCollectionError(null);
      try {
        const collectionDetail = await fetchCollectionDetails(item.belongs_to_collection.id);
        setCollectionData(collectionDetail);
      } catch (err) {
        setCollectionData(null);
        setCollectionError(err.message || "Unable to load collection details.");
      } finally {
        setCollectionLoading(false);
      }
    };

    loadCollection();
  }, [item?.belongs_to_collection?.id]);

  useEffect(() => {
    if (parentItem !== undefined) {
      return;
    }

    const loadDetail = async () => {
      setInternalLoading(true);
      setInternalError(null);
      try {
        const detail =
          itemType === "tv"
            ? await fetchSeriesDetails(id)
            : await fetchMovieDetails(id);
        if (!detail) {
          throw new Error("Item details not available");
        }
        setInternalItem(detail);
      } catch (err) {
        setInternalError(err.message || "Failed to load details");
      } finally {
        setInternalLoading(false);
      }
    };

    if (id) {
      loadDetail();
    }
  }, [id, itemType, parentItem]);

  if (loading) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center text-white">
        Loading movie details...
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center text-white">
        <p>{error || "No details available."}</p>
      </section>
    );
  }

  const imageBase = "https://image.tmdb.org/t/p/original";
  const title = item.title || item.name || "Untitled";
  const overview = item.overview || "No description available.";
  const releaseDate = item.release_date || item.first_air_date || "";
  const year = releaseDate ? releaseDate.slice(0, 4) : "";
  const runtime = item.runtime || item.episode_run_time?.[0] || 0;
  const country = item.production_countries?.[0]?.name || "Unknown";
  const genres = item.genres?.map((genre) => genre.name).join(", ");

  return (
    <section className="w-full min-h-screen relative single-movie-banner">
      <div className="relative overflow-hidden">
        <div className="banner-image relative h-[900px] sm:h-[820px] lg:h-[760px]">
          <img
            loading="lazy"
            decoding="async"
            src={`${imageBase}${item.backdrop_path || item.poster_path}`}
            alt={title}
            className="w-full h-full object-top object-cover"
          />

          <div className="absolute inset-0 bg-[#030A1B]/60"></div>

          <div className="container mx-auto">
            <div className="banner-content-box absolute inset-0 z-30 flex flex-col lg:flex-row items-start lg:items-center justify-center lg:justify-between gap-4 px-4 sm:px-8 md:px-16 pb-48 lg:pb-0">
              <div className="left-side-banner-content w-full lg:max-w-[70%] text-white mt-16 lg:mt-20">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight">
                  {title}
                </h1>

                <div className="info-movie-meta flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-200">
                  {runtime ? <span>{runtime}m</span> : null}
                  {year ? (
                    <>
                      <div className="w-1 h-1 rounded-full bg-white"></div>
                      <span>{year}</span>
                    </>
                  ) : null}
                  <div className="w-1 h-1 rounded-full bg-white"></div>
                  <span>{country}</span>
                </div>

                {genres ? (
                  <p className="mt-3 text-gray-300 text-sm">{genres}</p>
                ) : null}

                <div className="rating-icons-box mt-3 flex flex-wrap items-center justify-start gap-4">
                <div className=" rating-star text-yellow-400 text-lg flex items-center gap-3">
                  <span>{renderStars(item.vote_average)}</span>
                  <span className="text-gray-300">({item.vote_average ? item.vote_average.toFixed(1) : "N/A"}/10)</span>
                </div>

                <div className="flex items-center gap-4 icon-box">
                  <button
                  type="button"
                  onClick={() => toggleCollectionMovie(item)}
                  className={`w-12 h-12 rounded-full border border-[#228EE5] flex items-center justify-center transition ${
                    isSaved ? "bg-blue-500 text-white" : "bg-[#030A1B] text-white"
                  }`}
                >
                  <FaBookmark />
                </button>
              
                </div>
                </div>
              </div>

              <div className="watch-preview-btn flex flex-wrap items-center gap-4 mt-4 lg:mt-20">
                {isUpcoming ? (
                  <button
                    disabled
                    className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gray-600 text-white opacity-70 cursor-not-allowed"
                  >
                    Upcoming
                  </button>
                ) : (
                  <button className="flex items-center gap-3 px-8 py-3 rounded-xl bg-[#228EE5] hover:bg-blue-600 duration-300 text-white font-medium">
                    <FaPlay />
                    Watch Now
                  </button>
                )}

                <button className="px-8 py-3 rounded-xl border border-white/20 text-white hover:bg-white hover:text-black duration-300">
                  Preview
                </button>
              </div>
            </div>

            <div className="gallery-box absolute bottom-8 left-1/2 -translate-x-1/2 z-40 w-[92%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {(item.belongs_to_collection?.poster_path
                  ? [item.backdrop_path, item.poster_path, item.belongs_to_collection.poster_path]
                  : [item.backdrop_path, item.poster_path]
                )
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((image, idx) => (
                    <div key={idx} className="h-[100px] md:h-[140px] overflow-hidden rounded-2xl">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={`${imageBase}${image}`}
                        alt={`${title} gallery ${idx}`}
                        className="w-full h-full object-cover hover:scale-110 duration-500"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-movie-content px-4 sm:px-8 md:px-16 pb-14 pt-10 text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">About {title}</h2>

        <p className="text-gray-300 leading-[32px] max-w-[1100px]">
          {overview}
        </p>

        {item.belongs_to_collection?.id && (
          <div className="collection-summary mt-10 rounded-3xl border border-white/10 bg-white/5 p-4 md:p-8 shadow-xl shadow-black/20">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <img
                loading="lazy"
                decoding="async"
                src={`${imageBase}${collectionData?.poster_path || item.belongs_to_collection.poster_path}`}
                alt={collectionData?.name || item.belongs_to_collection.name}
                className="w-full max-w-[300px] rounded-3xl object-cover"
              />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="rounded-full bg-blue-600 px-3 py-1 text-sm font-semibold text-white">Collection</span>
                  <Link
                    to={`/collection/${item.belongs_to_collection.id}`}
                    className="text-2xl font-semibold text-white hover:text-blue-300"
                  >
                    {collectionData?.name || item.belongs_to_collection.name}
                  </Link>
                </div>

                {collectionLoading ? (
                  <p className="text-gray-400">Loading collection info...</p>
                ) : collectionError ? (
                  <p className="text-red-400">{collectionError}</p>
                ) : (
                  <>
                    <p className="text-gray-300 leading-8 max-w-3xl">
                      {collectionData?.overview || item.belongs_to_collection.name}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-400">
                      {collectionData?.parts?.length ? (
                        <span>{collectionData.parts.length} entries</span>
                      ) : null}
                      {collectionData?.parts?.[0]?.release_date ? (
                        <span>First part: {collectionData.parts[0].release_date.slice(0, 4)}</span>
                      ) : null}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
export default SingleMovieBanner;
