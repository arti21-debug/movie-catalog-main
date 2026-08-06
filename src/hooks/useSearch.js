import { useEffect, useRef, useState } from "react";

export function useSearch(query, currentPage) {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const effectRef = useRef(null);
  const queryRef = useRef(null);

  useEffect(() => {
    if (query) {
      document.title = `Search: ${query} — Filmbox`;
    }
  }, [query]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    };

    if (!query) return;
    if (queryRef.current !== query) {
      effectRef.current = null;
      queryRef.current = query;
    }

    async function creditsRequest(moviesResponse) {
      if (!moviesResponse.ok) throw new Error("Ошибка поиска");

      const moviesData = await moviesResponse.json();

      const moviesWithCredits = await Promise.all(
        moviesData.results.map(async (movie) => {
          const creditsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            {
              headers,
            },
          );

          const credits = await creditsResponse.json();

          const director = credits.crew?.find(
            (person) => person.job === "Director",
          );

          return {
            ...movie,
            director: director?.name,
            crewId: director?.id,
            crewDepartment: director?.department,
          };
        }),
      );

      return moviesWithCredits;
    }

    async function getMovies() {
      setLoading(true);

      try {
        if (effectRef.current) {
          const moviesResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`,
            {
              headers,
            },
          );

          const moviesWithCredits = await creditsRequest(moviesResponse);

          setSearchResult((movies) =>
            currentPage === 1
              ? [...moviesWithCredits]
              : [...movies, ...moviesWithCredits],
          );
        } else {
          let searched = [];

          for (let i = 1; i <= currentPage; i++) {
            const moviesResponse = await fetch(
              `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${i}`,
              {
                headers,
              },
            );

            const moviesWithCredits = await creditsRequest(moviesResponse);

            searched.push(...moviesWithCredits);
          }
          setSearchResult(searched);
        }

        effectRef.current = true;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  }, [query, currentPage]);

  return { searchResult, loading, error };
}