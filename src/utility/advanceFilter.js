import { discoverMovies, discoverTv } from "../api/api";

const getEffectiveGenreIds = (categories = [], genres = []) => {
  if (!categories.length || !genres.length) return [];

  const genreIds = genres
    .filter((genre) => categories.includes(genre.name))
    .map((genre) => genre.id);

  // All categories selected = same as no genre filter
  if (genreIds.length >= genres.length) return [];

  return genreIds;
};

const hasActiveFilters = (filters = {}, genres = []) => {
  const { year, country, actor, director, search } = filters;
  const genreIds = getEffectiveGenreIds(filters.categories, genres);

  return Boolean(
    year ||
      country ||
      actor ||
      director ||
      (search && search.trim().length >= 2) ||
      genreIds.length > 0
  );
};

const parsePersonId = (value) => {
  if (!value) return null;

  const id = Number(value);
  return Number.isNaN(id) ? null : id;
};

const applySearchFilter = (items, search = "") => {
  const query = search.trim().toLowerCase();
  if (!query || query.length < 2) return items;

  return items.filter((item) => {
    const title = (item.title || item.name || "").toLowerCase();
    const overview = (item.overview || "").toLowerCase();
    return title.includes(query) || overview.includes(query);
  });
};

const matchesGenreFilter = (item, genreIds) => {
  if (!genreIds.length) return true;
  if (!Array.isArray(item.genre_ids) || !item.genre_ids.length) return false;
  return item.genre_ids.some((id) => genreIds.includes(id));
};

const applyLocalFilters = (items, filters, genreIds) => {
  return items.filter((item) => {
    const date = item.release_date || item.first_air_date || "";
    const itemYear = date.slice(0, 4);

    if (filters.year && itemYear !== filters.year) return false;
    if (!matchesGenreFilter(item, genreIds)) return false;

    return true;
  });
};

const mergeUniqueById = (primary = [], secondary = []) => {
  const map = new Map();

  [...primary, ...secondary].forEach((item) => {
    if (item?.id) map.set(item.id, item);
  });

  return Array.from(map.values());
};

export const fetchFilteredMedia = async ({
  filters,
  genres = [],
  mediaType = "movie",
  fallbackData = [],
}) => {
  if (!hasActiveFilters(filters, genres)) {
    return fallbackData;
  }

  const genreIds = getEffectiveGenreIds(filters.categories, genres);
  const castId = parsePersonId(filters.actor);
  const crewId = parsePersonId(filters.director);

  const discoverFilters = {
    year: filters.year || undefined,
    country: filters.country || undefined,
    genreIds,
    castId: castId || (mediaType === "tv" ? crewId : null) || undefined,
    crewId: mediaType === "movie" ? crewId || undefined : undefined,
  };

  const discoverFn = mediaType === "tv" ? discoverTv : discoverMovies;
  let results = await discoverFn(discoverFilters);

  if (genreIds.length) {
    results = results.filter((item) => matchesGenreFilter(item, genreIds));
  }

  if (fallbackData.length) {
    const localResults = applyLocalFilters(fallbackData, filters, genreIds);

    if (!results.length) {
      results = localResults;
    } else if (genreIds.length) {
      results = mergeUniqueById(results, localResults).filter((item) =>
        matchesGenreFilter(item, genreIds)
      );
    }
  }

  if (filters.year && results.length) {
    results = results.filter((item) => {
      const date = item.release_date || item.first_air_date || "";
      return date.slice(0, 4) === filters.year;
    });
  }

  return applySearchFilter(results, filters.search);
};
