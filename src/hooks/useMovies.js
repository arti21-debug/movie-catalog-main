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
    document.title = "Filmbox - Film Catalog"
  }, []);

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

        const settled = await Promise.allSettled(requests);
        
        const moviePages = settled
        .filter(res => res.status === "fulfilled")
        .map(res => res.value);
        
        // Группируем по годам явно через slice
        // год 0: moviePages[0,1,2], год 1: moviePages[3,4,5] и тд
        const perYear = Math.floor(60 / (selectedYears.length || 1));

        const allMovies =
          selectedYears.length > 0
            ? selectedYears
                .flatMap(
                  (_, i) =>
                    moviePages
                      .slice(i * 3, i * 3 + 3) // берём 3 страницы этого года
                      .flatMap((page) => page.results) // объединяем результаты
                      .slice(0, perYear), // берём нужное количество
                )
                .slice(0, 60)
            : moviePages.flatMap((page) => page.results).slice(0, 60);

        const total = moviePages.reduce(
          (acc, page) => acc + page.total_results,
          0,
        );

        setMovieResult(allMovies);
        setTotalResults(total);
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
