import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { errorMessage, isAbortError, tmdbFetch } from "./tmdb";

// создаёт mock-функцию (заглушку)
const fetchMock = vi.fn();

// Создаёт имитацию ответа fetch.
// body — данные, которые вернёт метод json().
// init — дополнительные параметры ответа (ok и status).
// По умолчанию ok = true, status = 200.
const response = (
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
) => ({
  ok: init.ok ?? true,
  status: init.status ?? 200,
  json: async () => body,
});

beforeEach(() => {
  // Подменяем глобальный fetch на mock-функцию.
  vi.stubGlobal("fetch", fetchMock);
  // Устанавливаем тестовое значение переменной окружения.
  vi.stubEnv("VITE_TMDB_TOKEN", "test-token");
});

// после каждого теста очищает тестовое окружение
afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("tmdbFetch", () => {
  it("собирает адрес из базового URL, пути и параметров", async () => {
    fetchMock.mockResolvedValue(response({}));

    await tmdbFetch("/discover/movie", { page: 2, with_genres: "28|12" });

    const url: URL = fetchMock.mock.calls[0][0];
    expect(url.origin + url.pathname).toBe(
      "https://api.themoviedb.org/3/discover/movie",
    );
    expect(url.searchParams.get("page")).toBe("2"); // число превращается в строку
    expect(url.searchParams.get("with_genres")).toBe("28|12");
  });

  it("пропускает параметры со значением undefined", async () => {
    fetchMock.mockResolvedValue(response({}));

    await tmdbFetch("/movie/popular", {
      page: 1,
      primary_release_year: undefined,
    });

    const url: URL = fetchMock.mock.calls[0][0];
    expect(url.searchParams.has("primary_release_year")).toBe(false);
    expect(url.searchParams.get("page")).toBe("1");
  });

  it("кодирует спецсимволы в параметрах", async () => {
    fetchMock.mockResolvedValue(response({}));

    await tmdbFetch("/search/movie", { query: "Tom & Jerry" });

    const url: URL = fetchMock.mock.calls[0][0];
    // & внутри значения не должен начинать новый параметр
    expect(url.searchParams.get("query")).toBe("Tom & Jerry");
    expect(url.search).toContain("Tom+%26+Jerry");
  });

  it("передаёт токен в заголовке Authorization и AbortSignal", async () => {
    fetchMock.mockResolvedValue(response({}));
    const ctrl = new AbortController();

    await tmdbFetch("/movie/1", {}, ctrl.signal);

    const init = fetchMock.mock.calls[0][1];
    expect(init.headers.Authorization).toBe("Bearer test-token");
    expect(init.signal).toBe(ctrl.signal);
  });

  it("возвращает разобранный JSON", async () => {
    fetchMock.mockResolvedValue(response({ id: 603, title: "The Matrix" }));

    await expect(tmdbFetch("/movie/603")).resolves.toEqual({
      id: 603,
      title: "The Matrix",
    });
  });

  it("бросает ошибку со статусом, если ответ не 2xx", async () => {
    fetchMock.mockResolvedValue(response({}, { ok: false, status: 401 }));

    await expect(tmdbFetch("/movie/1")).rejects.toThrow("Request failed (401)");
  });
});

describe("isAbortError", () => {
  it("узнаёт ошибку отмены запроса", () => {
    expect(isAbortError(new DOMException("aborted", "AbortError"))).toBe(true);
  });

  it("не принимает за отмену обычные ошибки", () => {
    expect(isAbortError(new Error("boom"))).toBe(false);
    expect(isAbortError(new DOMException("x", "NetworkError"))).toBe(false);
    expect(isAbortError("AbortError")).toBe(false);
  });
});

describe("errorMessage", () => {
  it("берёт текст из Error", () => {
    expect(errorMessage(new Error("Request failed (500)"))).toBe(
      "Request failed (500)",
    );
  });

  it("возвращает запасной текст для неизвестного значения", () => {
    expect(errorMessage("строка")).toBe("Something went wrong");
    expect(errorMessage(null)).toBe("Something went wrong");
  });
});
