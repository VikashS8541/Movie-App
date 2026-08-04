const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const BASE_URL = "https://api.themoviedb.org/3";

// Common options
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};


// Trending Post
export const getTrendingPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/day`, options);

    if (!response.ok) {
      throw new Error("Failed to fetch trending movies");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Popular Post
export const getPopularPosts = async () =>{
    try {
        const response = await fetch(`${BASE_URL}/movie/popular`,options);
        if(!response.ok){
            throw new Error("Failed to fetch popular movies");
        }
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.log(error);
        return[];
    }
}

export const getUpcomingPosts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch upcoming movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// series
export const getSeriesPosts = async () =>{
  try {
    const response = await fetch(`${BASE_URL}/tv/popular`,options);
    if(!response.ok){
      throw new Error("Failed to fetch popular tv series");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export const getMovieGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch movie genres");
    }
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTvGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/tv/list`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch TV genres");
    }
    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getCollectionDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/collection/${id}`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch collection details");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const searchCollections = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(`${BASE_URL}/search/collection?query=${encodedQuery}`, options);
    if (!response.ok) {
      throw new Error("Failed to search collections");
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getMovieSimilar = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}/similar`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch similar movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTvSimilar = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}/similar`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch similar TV shows");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Search Post
export const searchPosts = async (query) =>{
    try {
        if (!query) throw new Error("Query is required");
        
        const encodedQuery = encodeURIComponent(query);
        const response = await fetch(`${BASE_URL}/search/movie?query=${encodedQuery}`, options);

        if(!response.ok){
           throw new Error("Failed to search movies");
        }

        const data = await response.json();
        return data.results;

    } catch (error) {
        console.error("Search error:", error);
        return[];
    }
}

export const searchTvPosts = async (query) => {
  try {
    if (!query) throw new Error("Query is required");

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${BASE_URL}/search/tv?query=${encodedQuery}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to search TV series");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("TV search error:", error);
    return [];
  }
};

// Movie detail by id
export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${id}?append_to_response=credits`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCountries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/configuration/countries`, options);

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPopularPeople = async (page = 1) => {
  try {
    const response = await fetch(
      `${BASE_URL}/person/popular?page=${page}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular people");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getTrendingPeople = async () => {
  try {
    const response = await fetch(`${BASE_URL}/trending/person/day`, options);

    if (!response.ok) {
      throw new Error("Failed to fetch trending people");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchPerson = async (query) => {
  try {
    if (!query) return [];

    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${BASE_URL}/search/person?query=${encodedQuery}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to search person");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const discoverMovies = async (filters = {}) => {
  try {
    const params = new URLSearchParams({
      sort_by: "popularity.desc",
      include_adult: "false",
      include_video: "false",
      page: "1",
    });

    if (filters.year) {
      params.append("primary_release_year", filters.year);
    }

    if (filters.genreIds?.length) {
      params.append("with_genres", filters.genreIds.join("|"));
    }

    if (filters.castId) {
      params.append("with_cast", String(filters.castId));
    }

    if (filters.crewId) {
      params.append("with_crew", String(filters.crewId));
    }

    if (filters.country) {
      params.append("with_origin_country", filters.country);
    }

    const response = await fetch(
      `${BASE_URL}/discover/movie?${params.toString()}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to discover movies");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const discoverTv = async (filters = {}) => {
  try {
    const params = new URLSearchParams({
      sort_by: "popularity.desc",
      include_adult: "false",
      page: "1",
    });

    if (filters.year) {
      params.append("first_air_date_year", filters.year);
    }

    if (filters.genreIds?.length) {
      params.append("with_genres", filters.genreIds.join("|"));
    }

    if (filters.castId) {
      params.append("with_cast", String(filters.castId));
    }

    if (filters.country) {
      params.append("with_origin_country", filters.country);
    }

    const response = await fetch(
      `${BASE_URL}/discover/tv?${params.toString()}`,
      options
    );

    if (!response.ok) {
      throw new Error("Failed to discover TV series");
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// TV detail by id
export const getTvDetails = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?append_to_response=credits`, options);
    if (!response.ok) {
      throw new Error("Failed to fetch TV series details");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};