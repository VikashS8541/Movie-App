import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CiSearch } from "react-icons/ci";
import advancefilter from "../assets/images/advancefilter-image.svg";
import FilterSuggestInput from "./FilterSuggestInput";
import {
  advanceFilterDefaultValues,
  advanceFilterSchema,
} from "../schemas/advanceFilterSchemas";
import {
  buildYearOptions,
  fetchAdvanceFilterOptions,
} from "../data/advanceFilterData";
import {
  fetchMovieGenres,
  fetchSearchPosts,
  fetchSearchTvPosts,
  fetchSeriesGenres,
  IMAGE_BASE_URL,
} from "../utility/useMovies";

const selectClassName =
  "w-full bg-[#081A33] border border-[#163760] rounded-full px-5 py-3 text-white outline-none";

const defaultFilterOptions = {
  yearOptions: buildYearOptions(),
  countryOptions: [{ value: "", label: "Any Country" }],
  actorOptions: [{ value: "", label: "Any Actor" }],
  directorOptions: [{ value: "", label: "Any Director" }],
};

const AdvanceFilterForm = ({ onFilter, mediaType = "movie", isFiltering = false }) => {
  const [genres, setGenres] = useState([]);
  const [filterOptions, setFilterOptions] = useState(defaultFilterOptions);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const lastFilterKeyRef = useRef("");

  const {
    register,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(advanceFilterSchema),
    defaultValues: advanceFilterDefaultValues,
  });

  const selectedCategories = watch("categories") || [];
  const yearValue = watch("year");
  const countryValue = watch("country");
  const actorValue = watch("actor");
  const directorValue = watch("director");
  const searchValue = watch("search");

  const applyFilter = useCallback(
    (filters) => {
      const searchTrimmed = (filters.search || "").trim();
      if (searchTrimmed.length === 1) return;

      const normalizedFilters = {
        ...filters,
        search: searchTrimmed,
      };

      const parsed = advanceFilterSchema.safeParse(normalizedFilters);
      if (!parsed.success) return;

      const filterKey = JSON.stringify(parsed.data);
      if (filterKey === lastFilterKeyRef.current) return;

      lastFilterKeyRef.current = filterKey;
      onFilter?.(parsed.data);
    },
    [onFilter]
  );

  useEffect(() => {
    if (optionsLoading) return;

    applyFilter(getValues());
  }, [
    yearValue,
    countryValue,
    actorValue,
    directorValue,
    selectedCategories.join(","),
    optionsLoading,
    applyFilter,
    getValues,
  ]);

  useEffect(() => {
    if (optionsLoading) return;

    const searchTrimmed = (searchValue || "").trim();
    if (searchTrimmed.length === 1) return;

    applyFilter(getValues());
  }, [searchValue, optionsLoading, applyFilter, getValues]);

  useEffect(() => {
    const loadFormData = async () => {
      setOptionsLoading(true);

      try {
        const [genreData, options] = await Promise.all([
          mediaType === "tv" ? fetchSeriesGenres() : fetchMovieGenres(),
          fetchAdvanceFilterOptions(),
        ]);

        setGenres(genreData || []);
        setFilterOptions(options);
      } catch (error) {
        setGenres([]);
        setFilterOptions(defaultFilterOptions);
      } finally {
        setOptionsLoading(false);
      }
    };

    loadFormData();
  }, [mediaType]);

  const fetchMediaSuggestions = useCallback(
    async (query) => {
      const results =
        mediaType === "tv"
          ? await fetchSearchTvPosts(query)
          : await fetchSearchPosts(query);

      return results.map((item) => {
        const title = item.title || item.name || "Untitled";
        const date = item.release_date || item.first_air_date || "";
        const year = date ? ` (${date.slice(0, 4)})` : "";

        return {
          value: title,
          label: `${title}${year}`,
          image: item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : null,
        };
      });
    },
    [mediaType]
  );

  const handleActiveCat = (categoryName) => {
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((item) => item !== categoryName)
      : [...selectedCategories, categoryName];

    // All genres selected = same as "All" (no genre filter)
    const finalCategories =
      genres.length > 0 && updatedCategories.length >= genres.length
        ? []
        : updatedCategories;

    setValue("categories", finalCategories, { shouldValidate: true });
  };

  const handleReset = () => {
    reset(advanceFilterDefaultValues);
    lastFilterKeyRef.current = "";
    onFilter?.(advanceFilterDefaultValues);
  };

  return (
    <section className="advance-filter-form relative">
      <div className="advance-filter-form bg-[#030A1B] border border-[#228EE5] rounded-3xl p-8 py-16 relative">
        <div className="absolute -top-5 left-8 flex items-center gap-3">
          <span className="bg-[#228EE6] text-white px-6 py-3 rounded-full text-lg font-medium">
            {optionsLoading ? "Loading..." : isFiltering ? "Filtering..." : "Advance Search"}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#228EE6] border border-[#228EE6] text-white px-5 py-3 rounded-full text-lg font-medium"
          >
            Clear
          </button>
        </div>

        <div className="flex items-center gap-20 filter-image-box pb-10">
          <div className="hidden lg:block image-icon w-1/4">
            <img
              loading="lazy"
              decoding="async"
              src={advancefilter}
              alt="search-movie"
              className="w-full"
            />
          </div>

          <div className="flex-1 search-field-box">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Year</label>
                <select
                  {...register("year")}
                  disabled={optionsLoading}
                  className={selectClassName}
                >
                  {filterOptions.yearOptions.map((option) => (
                    <option key={`year-${option.value || "any"}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Country</label>
                <select
                  {...register("country")}
                  disabled={optionsLoading}
                  className={selectClassName}
                >
                  {filterOptions.countryOptions.map((option) => (
                    <option key={`country-${option.value || "any"}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Actor</label>
                <select
                  {...register("actor")}
                  disabled={optionsLoading}
                  className={selectClassName}
                >
                  {filterOptions.actorOptions.map((option) => (
                    <option key={`actor-${option.value || "any"}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-2 justify-end">
              <div className="relative mt-4 flex flex-col justify-end w-full">
                <FilterSuggestInput
                  value={searchValue}
                  onChange={(value) => setValue("search", value, { shouldValidate: true })}
                  fetchSuggestions={fetchMediaSuggestions}
                  placeholder="Search movies or series..."
                  minChars={2}
                  syncOnType
                  disabled={optionsLoading}
                  endAdornment={<CiSearch fontSize={"20px"} className="text-white" />}
                  error={errors.search?.message}
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Director</label>
                <select
                  {...register("director")}
                  disabled={optionsLoading}
                  className={selectClassName}
                >
                  {filterOptions.directorOptions.map((option) => (
                    <option key={`director-${option.value || "any"}`} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="category-items flex items-center justify-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => setValue("categories", [], { shouldValidate: true })}
            className={`${
              selectedCategories.length === 0
                ? "bg-pink-500 text-white"
                : "bg-transparent"
            } px-6 py-2 rounded-full border border-pink-500 hover:bg-pink-500 text-white whitespace-nowrap outline-none transition duration-300`}
          >
            All
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              type="button"
              onClick={() => handleActiveCat(genre.name)}
              className={`${
                selectedCategories.includes(genre.name)
                  ? "bg-pink-500 text-white"
                  : "bg-transparent"
              } px-6 py-2 rounded-full border border-pink-500 hover:bg-pink-500 text-white whitespace-nowrap outline-none transition duration-300`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdvanceFilterForm;
