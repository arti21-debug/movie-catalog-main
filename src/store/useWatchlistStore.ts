import { Movie, WatchlistMovie, WatchStatus } from "@/types/tmdb";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// стор «списка к просмотру»: фильмы с пользовательским статусом (WatchStatus)
interface WatchlistStore {
  watchlist: WatchlistMovie[];
  addMovie: (movie: Movie, status: WatchStatus) => void;
  removeMovie: (id: number) => void;
}

// добавление в список без лишних данных, только необходимое
const toListItem = (
  movie: Pick<
    Movie,
    | "id"
    | "title"
    | "overview"
    | "poster_path"
    | "release_date"
    | "vote_average"
  >,
  status: WatchStatus,
): WatchlistMovie => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  poster_path: movie.poster_path,
  release_date: movie.release_date,
  vote_average: movie.vote_average,
  status,
});

// persist сохраняет список в localStorage и восстанавливает его при перезагрузке страницы
export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set) => ({
      watchlist: [],

      addMovie: (movie, status) =>
        set((state) => {
          // фильм уже в списке?
          const exists = state.watchlist.find((m) => m.id === movie.id);

          // да — обновляем только статус, остальные данные не трогаем
          if (exists) {
            return {
              watchlist: state.watchlist.map((m) =>
                m.id === movie.id ? toListItem(movie, status) : m,
              ),
            };
          }

          // нет — добавляем в конец вместе со статусом
          return {
            watchlist: [...state.watchlist, toListItem(movie, status)],
          };
        }),

      // удаляет фильм по id
      removeMovie: (id) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== id),
        })),
    }),
    // ключ в localStorage
    {
      name: "watchlist",
      version: 1, // позволяет вызвать migrate
      // записываем в storage только необходимое, не раздувая память хранилища лишними данными
      migrate: (persisted) => {
        const old = persisted as { watchlist?: WatchlistMovie[] } | undefined;
        return {
          watchlist: (old?.watchlist ?? []).map((m) => toListItem(m, m.status)),
        };
      },
    },
  ),
);
