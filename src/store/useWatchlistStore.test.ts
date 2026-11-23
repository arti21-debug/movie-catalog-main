// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { useWatchlistStore } from "./useWatchlistStore";
import { Movie, WatchlistMovie } from "@/types/tmdb";

// «жирный» фильм, каким он приходит с страницы фильма: много лишних полей
const fullMovie = {
  id: 603,
  title: "The Matrix",
  overview: "A hacker learns the truth.",
  poster_path: "/matrix.jpg",
  release_date: "1999-03-30",
  vote_average: 8.2,
  credits: { cast: new Array(100).fill({ name: "x" }) },
  similar: { results: new Array(20).fill({ id: 1 }) },
} as unknown as Movie;

beforeEach(() => {
  localStorage.clear();
  useWatchlistStore.setState({ watchlist: [] });
});

describe("useWatchlistStore", () => {
  it("добавляет фильм со статусом", () => {
    useWatchlistStore.getState().addMovie(fullMovie, "watched");

    const [item] = useWatchlistStore.getState().watchlist;
    expect(item.id).toBe(603);
    expect(item.status).toBe("watched");
  });

  it("сохраняет только поля карточки, а не весь объект фильма", () => {
    useWatchlistStore.getState().addMovie(fullMovie, "watched");

    const [item] = useWatchlistStore.getState().watchlist;
    expect(Object.keys(item).sort()).toEqual(
      [
        "id",
        "overview",
        "poster_path",
        "release_date",
        "status",
        "title",
        "vote_average",
      ].sort(),
    );
  });

  it("повторное добавление меняет статус и не создаёт дубль", () => {
    const { addMovie } = useWatchlistStore.getState();
    addMovie(fullMovie, "want");
    addMovie(fullMovie, "watched");

    const list = useWatchlistStore.getState().watchlist;
    expect(list).toHaveLength(1);
    expect(list[0].status).toBe("watched");
  });

  it("удаляет фильм по id", () => {
    const { addMovie, removeMovie } = useWatchlistStore.getState();
    addMovie(fullMovie, "want");
    addMovie({ ...fullMovie, id: 1 } as Movie, "want");

    removeMovie(603);

    expect(useWatchlistStore.getState().watchlist.map((m) => m.id)).toEqual([
      1,
    ]);
  });

  it("записывает список в localStorage под ключом watchlist", () => {
    useWatchlistStore.getState().addMovie(fullMovie, "want");

    const saved = JSON.parse(localStorage.getItem("watchlist")!);
    expect(saved.version).toBe(1);
    expect(saved.state.watchlist[0].id).toBe(603);
  });
});

describe("migrate (старые данные из localStorage)", () => {
  // migrate лежит в настройках persist, отдельно не экспортируется
  const migrate = useWatchlistStore.persist.getOptions().migrate!;

  it("обрезает раздутые записи старого формата до полей карточки", () => {
    const legacy = {
      watchlist: [
        { ...fullMovie, status: "want" } as unknown as WatchlistMovie,
      ],
    };

    const migrated = migrate(legacy, 0) as { watchlist: WatchlistMovie[] };

    expect(migrated.watchlist[0]).not.toHaveProperty("credits");
    expect(migrated.watchlist[0]).not.toHaveProperty("similar");
    expect(migrated.watchlist[0].title).toBe("The Matrix");
    expect(migrated.watchlist[0].status).toBe("want");
  });

  it("не падает на пустых или повреждённых данных", () => {
    expect(migrate(undefined, 0)).toEqual({ watchlist: [] });
    expect(migrate({}, 0)).toEqual({ watchlist: [] });
  });
});
