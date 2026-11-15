/** Корневой адрес TMDB API v3. */
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Query-параметры запроса.
 * Значения `undefined` игнорируются, поэтому необязательные параметры
 * можно передавать без предварительных проверок.
 */
type Params = Record<string, string | number | undefined>;

/**
 * Типизированная обёртка над `fetch` для TMDB API.
 *
 * @typeParam T - ожидаемая форма JSON-ответа (задаётся вызывающим кодом;
 *                в рантайме не проверяется).
 * @param path   - путь эндпоинта, начинающийся со `/` (например, `/movie/popular`).
 * @param params - query-параметры; `undefined`-значения пропускаются.
 * @param signal - необязательный `AbortSignal` для отмены запроса.
 * @throws {Error} если сервер ответил статусом вне диапазона 2xx
 *                 (`fetch` сам такие ответы ошибкой не считает).
 */
export async function tmdbFetch<T>(
  path: string,
  params: Params = {},
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(BASE_URL + path);

  // searchParams принимает только строки и сам кодирует спецсимволы.
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: {
      // Read Access Token из TMDB. Переменные VITE_* попадают в клиентский
      // бандл, то есть токен виден пользователям.
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    },
    signal,
  });

  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

/**
 * Определяет, что ошибка вызвана отменой запроса через `AbortController`.
 * Такие ошибки обычно игнорируют: отмена не является сбоем.
 */
export const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === "AbortError";

/**
 * Безопасно извлекает текст ошибки из `unknown` (тип значения в `catch`)
 * для показа в интерфейсе.
 */
export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong";
