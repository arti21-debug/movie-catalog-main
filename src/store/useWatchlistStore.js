import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWatchlistStore = create(
  persist(
    (set, get) => ({
      watchlist: [],

      addMovie: (movie, status) =>
        set((state) => ({
          watchlist: [...state.watchlist, { ...movie, status }],
        })),

      removeMovie: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),

      changeStatus: (id, status) =>
        set((state) => ({
          watchlist: state.watchlist.map((m) =>
            m.id === id ? { ...m, status } : m,
          ),
        })),

      getStatus: (id) =>
        get().watchlist.find((m) => m.id === id)?.status ?? null,
    }),
    { name: "watchlist" },
  ),
);