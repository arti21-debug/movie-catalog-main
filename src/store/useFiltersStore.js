import { create } from "zustand";

export const useFiltersStore = create((set, get) => ({
  genres: [],
  countries: [],

  genresLoading: false,
  countriesLoading: false,

  genresError: null,
  countriesError: null,

  fetchGenres: async () => {
    if (get().genres.length > 0) return;

    if (get().genresLoading) return;

    set({ genresLoading: true, genresError: null });

    try {
      const res = await fetch("https://api.themoviedb.org/3/genre/movie/list", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
          accept: "application/json",
        },
      });

      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const data = await res.json();
      set({ genres: data.genres });
    } catch (err) {
      set({ genresError: err.message });
    } finally {
      set({ genresLoading: false });
    }
  },

  fetchCountries: async () => {
    if (get().countries.length > 0) return;
    if (get().countriesLoading) return;

    set({ countriesLoading: true, countriesError: null });

    try {
      const res = await fetch(
        "https://api.themoviedb.org/3/configuration/countries",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
            accept: "application/json",
          },
        },
      );

      if (!res.ok) throw new Error(`Ошибка: ${res.status}`);

      const data = await res.json();
      set({ countries: data });
    } catch (err) {
      set({ countriesError: err.message });
    } finally {
      set({ countriesLoading: false });
    }
  },
}));