import { SearchedMovie } from "@/types/tmdb";
import { useEffect, useRef, useState } from "react";

interface Search {
  query: string;
  currentPage: number;
}

export function useSearch({ query, currentPage }: Search) {
  const [searchResult, setSearchResult] = useState<SearchedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const effectRef = useRef<true | null>(null);
  const queryRef = useRef<string | null>(null);

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

    async function creditsRequest(
      moviesResponse: Response
    ): Promise<SearchedMovie[]> {
      if (!moviesResponse.ok) throw new Error("Ошибка поиска");

      const moviesData = await moviesResponse.json();

      const moviesWithCredits = await Promise.all(
        moviesData.results.map(async (movie: SearchedMovie) => {
          const creditsReq = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits`,
            {
              headers,
            },
          );

          const credits = await creditsReq.json();

          const director = credits.crew?.find(
            (person: {
              job: string;
              name: string;
              id: number;
              department: string;
            }) => person.job === "Director",
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
          const moviesReq = await fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${currentPage}`,
            {
              headers,
            },
          );

          const moviesWithCredits = await creditsRequest(moviesReq);

          setSearchResult((movies) =>
            currentPage === 1
              ? [...moviesWithCredits]
              : [...movies, ...moviesWithCredits],
          );
        } else {
          let searched: SearchedMovie[] = [];

          for (let i = 1; i <= currentPage; i++) {
            const moviesReq = await fetch(
              `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&page=${i}`,
              {
                headers,
              },
            );

            const moviesWithCredits = await creditsRequest(moviesReq);

            searched.push(...moviesWithCredits);
          }
          setSearchResult(searched);
        }

        effectRef.current = true;
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getMovies();
  }, [query, currentPage]);

  return { searchResult, loading, error };
}
