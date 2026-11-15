import { tmdbFetch } from "@/lib/tmdb";
import { Country, Genre } from "@/types/tmdb";
import { create } from "zustand";

interface FilterStore {
  genres: Genre[];
  countries: Country[];

  genresLoading: boolean;
  countriesLoading: boolean;

  genresError: string | null;
  countriesError: string | null;

  fetchGenres: () => Promise<void>;
  fetchCountries: () => Promise<void>;
}

export const useFiltersStore = create<FilterStore>((set, get) => ({
  genres: [],
  countries: [],

  genresLoading: false,
  countriesLoading: false,

  genresError: null,
  countriesError: null,

  // загружает список жанров
  fetchGenres: async () => {
    // уже загружено — повторный запрос не нужен (кэш в памяти)
    if (get().genres.length > 0) return;

    // запрос уже идёт — не дублируем
    if (get().genresLoading) return;

    // включаем загрузку и очищаем прошлую ошибку, чтобы повторная попытка была «с чистого листа»
    set({ genresLoading: true, genresError: null });

    try {
      const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
      set({ genres: data.genres });
    } catch (err) {
      if (err instanceof Error) {
        set({ genresError: err.message });
      }
    } finally {
      // загрузка закончена в любом случае: успех или ошибка
      set({ genresLoading: false });
    }
  },

  // загружает список стран; логика та же, что у жанров
  fetchCountries: async () => {
    if (get().countries.length > 0) return;
    if (get().countriesLoading) return;

    set({ countriesLoading: true, countriesError: null });

    try {
      set({
        countries: await tmdbFetch<Country[]>("/configuration/countries"),
      });
    } catch (err) {
      if (err instanceof Error) {
        set({ countriesError: err.message });
      }
    } finally {
      set({ countriesLoading: false });
    }
  },
}));
