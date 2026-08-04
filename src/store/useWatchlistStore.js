import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWatchlistStore = create(
  persist(
    (set, _) => ({
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