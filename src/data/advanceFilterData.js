import {
  getCountries,
  getPopularPeople,
  getTrendingPeople,
  getPopularPosts,
  getMovieDetails,
} from "../api/api";

const ANY_YEAR = { value: "", label: "Any Year" };
const ANY_COUNTRY = { value: "", label: "Any Country" };
const ANY_ACTOR = { value: "", label: "Any Actor" };
const ANY_DIRECTOR = { value: "", label: "Any Director" };

export const buildYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [ANY_YEAR];

  for (let year = currentYear; year >= 1960; year -= 1) {
    years.push({
      value: String(year),
      label: String(year),
    });
  }

  return years;
};

const uniqueById = (people = []) => {
  const map = new Map();

  people.forEach((person) => {
    if (person?.id && person?.name) {
      map.set(person.id, person);
    }
  });

  return Array.from(map.values());
};

const mapPeopleToOptions = (people = [], fallbackLabel) => {
  if (!people.length) {
    return [fallbackLabel];
  }

  return [
    fallbackLabel,
    ...people.map((person) => ({
      value: String(person.id),
      label: person.name,
    })),
  ];
};

const getDirectorsFromPopularMovies = async () => {
  try {
    const movies = await getPopularPosts();
    const directorMap = new Map();

    await Promise.all(
      movies.slice(0, 5).map(async (movie) => {
        const details = await getMovieDetails(movie.id);
        const directors =
          details?.credits?.crew?.filter(
            (member) => member.job?.toLowerCase() === "director"
          ) || [];

        directors.forEach((director) => {
          if (director.id && director.name) {
            directorMap.set(director.id, {
              id: director.id,
              name: director.name,
            });
          }
        });
      })
    );

    return Array.from(directorMap.values());
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchAdvanceFilterOptions = async () => {
  const [countries, popularPage1, popularPage2, trendingPeople, movieDirectors] =
    await Promise.all([
      getCountries(),
      getPopularPeople(1),
      getPopularPeople(2),
      getTrendingPeople(),
      getDirectorsFromPopularMovies(),
    ]);

  const allPeople = uniqueById([
    ...popularPage1,
    ...popularPage2,
    ...trendingPeople,
  ]);

  const actors = allPeople.filter(
    (person) => person.known_for_department === "Acting"
  );

  const directorsFromPeople = allPeople.filter(
    (person) => person.known_for_department === "Directing"
  );

  const directors = uniqueById([...directorsFromPeople, ...movieDirectors]);

  const countryOptions = [
    ANY_COUNTRY,
    ...countries
      .filter((country) => country.iso_3166_1 && country.english_name)
      .sort((a, b) => a.english_name.localeCompare(b.english_name))
      .map((country) => ({
        value: country.iso_3166_1,
        label: country.english_name,
      })),
  ];

  return {
    yearOptions: buildYearOptions(),
    countryOptions,
    actorOptions: mapPeopleToOptions(actors, ANY_ACTOR),
    directorOptions: mapPeopleToOptions(directors, ANY_DIRECTOR),
  };
};
