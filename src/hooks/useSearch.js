import { useEffect, useState } from "react";

export function useSearch(query) {
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            },
          },
        ).then((r) => {
          if (!r.ok) throw new Error("Ошибка поиска");
          return r.json();
        });

        setSearchResult (res.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return { searchResult, loading, error };
}