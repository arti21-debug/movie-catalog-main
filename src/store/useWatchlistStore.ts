import { Movie, WatchlistMovie, WatchStatus } from "@/types/tmdb";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistStore {
  watchlist: WatchlistMovie[];
  addMovie: (movie: Movie, status: WatchStatus) => void;
  removeMovie: (id: number) => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      watchlist: [],

      addMovie: (movie, status) =>
        set((state) => {
          const exists = state.watchlist.find((m) => m.id === movie.id);

          if (exists) {
            return {
              watchlist: state.watchlist.map((m) =>
                m.id === movie.id ? { ...m, status } : m,
              ),
            };
          }

          return {
            watchlist: [...state.watchlist, { ...movie, status }],
          };
        }),

      removeMovie: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),
    }),
    { name: "watchlist" },
  ),
);