import { useEffect, useState } from "react";

export function useMovies({
  currentGroup,
  selectedGenres,
  selectedCountries,
  selectedRuntime,
  selectedYears,
  selectedRating,
}) {
  const [movieResult, setMovieResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(null);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);

      const startPage = (currentGroup - 1) * 3 + 1;
      const pages = [startPage, startPage + 1, startPage + 2];

      const params = new URLSearchParams();
      if (selectedGenres.length > 0)
        params.set("with_genres", selectedGenres.join("|"));
      if (selectedCountries.length > 0)
        params.set("with_origin_country", selectedCountries.join("|"));
      if (selectedRuntime.min !== null)
        params.set("with_runtime.gte", selectedRuntime.min);
      if (selectedRuntime.max !== null)
        params.set("with_runtime.lte", selectedRuntime.max);
      if (selectedRating.min !== null) {
        params.set("vote_average.gte", selectedRating.min);
        params.set("vote_count.gte", 100);
      }
      
      const hasFilters =
        selectedGenres.length > 0 ||
        selectedCountries.length > 0 ||
        selectedRuntime.min !== null ||
        selectedRuntime.max !== null ||
        selectedRating.min !== null ||
        selectedYears.length > 0;
      const baseUrl = hasFilters
        ? `https://api.themoviedb.org/3/discover/movie?${params}`
        : `https://api.themoviedb.org/3/movie/popular?language=en-EN`;

      try {
        const headers = {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          accept: "application/json",
        };

        const requests =
          selectedYears.length > 0
            ? selectedYears.flatMap((year) =>
                pages.map((page) =>
                  fetch(
                    `${baseUrl}&primary_release_year=${year}&page=${page}`,
                    { headers },
                  ).then((res) => {
                    if (!res.ok) throw new Error("Ошибка запроса");
                    return res.json();
                  }),
                ),
              )
            : pages.map((page) =>
              fetch(`${baseUrl}&page=${page}`, { headers }).then((res) => {
                  if (!res.ok) throw new Error("Ошибка запроса");
                  return res.json();
                }),
              );

        const moviePages = await Promise.all(requests);
        const allMovies = moviePages.flatMap((page) => page.results);

        setMovieResult(allMovies);
        setTotalResults(moviePages[0].total_results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [
    currentGroup,
    selectedGenres,
    selectedCountries,
    selectedRuntime,
    selectedYears,
    selectedRating,
  ]);

  return { movieResult, loading, error, totalResults };
}