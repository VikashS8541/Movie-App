import { getPopularPosts, getTrendingPosts, searchPosts, searchTvPosts, searchCollections, getSeriesPosts, getUpcomingPosts, getMovieDetails, getTvDetails, getMovieSimilar, getTvSimilar, getMovieGenres, getTvGenres, getCollectionDetails, discoverMovies, discoverTv, searchPerson, getCountries, getPopularPeople, getTrendingPeople } from '../api/api'


// fetchTrendingPosts
export const fetchTrendingPosts = async () => {
  return await getTrendingPosts();
};

// fetchPopularPosts
export const fetchPopularPosts = async () => {
  return await getPopularPosts();
};


// fetchPopularTVSeries
export const fetchTvPosts = async () => {
  return await getSeriesPosts();
};

export const fetchUpcomingPosts = async () => {
  return await getUpcomingPosts();
};

// Fetch search items - FIXED: Now calls searchPosts correctly
export const fetchSearchPosts = async (query = "batman") => {
  return await searchPosts(query);
};

export const fetchSearchTvPosts = async (query) => {
  return await searchTvPosts(query);
};

export const fetchMovieDetails = async (id) => {
  return await getMovieDetails(id);
};

export const fetchSeriesDetails = async (id) => {
  return await getTvDetails(id);
};

export const fetchMovieGenres = async () => {
  return await getMovieGenres();
};

export const fetchSeriesGenres = async () => {
  return await getTvGenres();
};

export const fetchMovieSimilar = async (id) => {
  return await getMovieSimilar(id);
};

export const fetchSeriesSimilar = async (id) => {
  return await getTvSimilar(id);
};

export const fetchCollectionDetails = async (id) => {
  return await getCollectionDetails(id);
};

export const fetchCollectionSearch = async (query) => {
  return await searchCollections(query);
};

export const fetchDiscoverMovies = async (filters) => {
  return await discoverMovies(filters);
};

export const fetchDiscoverTv = async (filters) => {
  return await discoverTv(filters);
};

export const fetchPersonSearch = async (query) => {
  return await searchPerson(query);
};

export const fetchCountries = async () => {
  return await getCountries();
};

export const fetchPopularPeople = async (page = 1) => {
  return await getPopularPeople(page);
};

export const fetchTrendingPeople = async () => {
  return await getTrendingPeople();
};
// Professional custom hook for API calls
// export const useFetchMovies = (fetchFunction) => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const result = await fetchFunction();
//         setData(result || []);
//       } catch (err) {
//         setError(err.message);
//         setData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadData();
//   }, []);

//   return { data, loading, error };
// };


export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";