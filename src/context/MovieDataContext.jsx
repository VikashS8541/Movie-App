import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchTrendingPosts,
  fetchPopularPosts,
  fetchTvPosts,
  fetchMovieGenres,
  fetchSeriesGenres,
} from "../utility/useMovies";
import { studiosImage as studiosImageData } from "../data/dummyData";

export const MovieDataContext = createContext(null);

const defaultCollectionTab = [
  { id: "all", title: "All" },
  { id: "movies", title: "Movies" },
  { id: "series", title: "Series" },
];

const defaultCastProfiles = [
  { id: 1, title: "Actors" },
  { id: 2, title: "Directors" },
];

const defaultPricingData = [
  {
    id: 1,
    title: "Basic",
    duration: "1 Month",
    price: "$8.99",
    oldPrice: null,
    active: false,
  },
  {
    id: 2,
    title: "Standard",
    duration: "3 Months",
    price: "$19.99",
    oldPrice: "$24.99",
    active: true,
  },
  {
    id: 3,
    title: "Premium",
    duration: "1 Year",
    price: "$64.99",
    oldPrice: null,
    active: false,
  },
];

const defaultFaqData = [
  {
    id: 1,
    question: "How do I watch movies?",
    answer: "Use the watch buttons to open the movie details page and stream available content.",
  },
  {
    id: 2,
    question: "Where can I find trending titles?",
    answer: "The Trends page shows the most popular movies from the API right now.",
  },
  {
    id: 3,
    question: "How do collections work?",
    answer: "Collections group related titles and recommend similar movies based on the selected item.",
  },
];

export const MovieDataProvider = ({ children }) => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [savedCollectionMovies, setSavedCollectionMovies] = useState([]);
  const [continueMovies, setContinueMovies] = useState([]);
  const [moviesGalleryData, setMoviesGalleryData] = useState([]);
  const [suggestionDataMovie, setSuggestionDataMovie] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [trending, popularMovies, popularSeries, movieGenres, tvGenres] =
          await Promise.all([
            fetchTrendingPosts(),
            fetchPopularPosts(),
            fetchTvPosts(),
            fetchMovieGenres(),
            fetchSeriesGenres(),
          ]);

        setTrendingMovies(trending || []);
        setHeroMovies(trending?.slice(0, 5) || []);
        setMoviesList(popularMovies || []);
        setSeriesList(popularSeries || []);
        setContinueMovies(trending?.slice(0, 8) || []);
        setMoviesGalleryData(trending?.slice(0, 6) || []);
        setSuggestionDataMovie(trending?.slice(0, 6) || []);
        setCategories([...(movieGenres || []), ...(tvGenres || [])]);
      } catch (error) {
        console.error("MovieDataContext load error:", error);
      }
    };

    loadInitialData();
  }, []);

  const toggleCollectionMovie = (movie) => {
    if (!movie?.id) return;

    const movieTitle = movie.title || movie.name || "Movie";

    setSavedCollectionMovies((prev) => {
      const exists = prev.some((item) => item.id === movie.id);
      if (exists) {
        toast.info(`"${movieTitle}" removed from collection`);
        return prev.filter((item) => item.id !== movie.id);
      }
      toast.success(`"${movieTitle}" added to collection`);
      return [...prev, movie];
    });
  };

  const value = {
    trendingMovies,
    heroMovies,
    categories,
    moviesList,
    collectionTab: defaultCollectionTab,
    castProfiles: defaultCastProfiles,
    characterCasts: [],
    continueMovies,
    studiosImage: studiosImageData,
    pricingData: defaultPricingData,
    faqData: defaultFaqData,
    savedCollectionMovies,
    toggleCollectionMovie,
    seriesList,
    moviesGalleryData,
    suggestionDataMovie,
  };

  return (
    <MovieDataContext.Provider value={value}>
      {children}
    </MovieDataContext.Provider>
  );
};
