import { errorMessage, isAbortError, tmdbFetch } from "@/lib/tmdb";
import { Movie, MoviePage, RatingOption, RuntimeOption } from "@/types/tmdb";
import { countTotalResults } from "@/utils/countTotalResults";
import { useEffect, useState } from "react";

interface MoviesData {
  currentGroup: number;
  selectedGenres: number[];
  selectedCountries: string[];
  selectedRuntime: RuntimeOption;
  selectedYears: number[];
  selectedRating: RatingOption;
}

// хук каталога фильмов: загружает «группу» из 3 страниц TMDB (по 20 фильмов, итого до 60)
export function useMovies({
  currentGroup,
  selectedGenres,
  selectedCountries,
  selectedRuntime,
  selectedYears,
  selectedRating,
}: MoviesData) {
  const [movieResult, setMovieResult] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    document.title = "Filmbox - Film Catalog";
  }, []);

  // перезагрузка фильмов при смене страницы или любого фильтра
  useEffect(() => {
    const ctrl = new AbortController();
    const { signal } = ctrl;

    async function loadMovies() {
      setLoading(true);
      setError(null); // сбрасываем ошибку прошлой попытки

      // одна «страница» интерфейса = 3 страницы TMDB подряд:
      // группа 1 → страницы 1–3, группа 2 → 4–6 и т.д.
      const startPage = (currentGroup - 1) * 3 + 1;
      const pages = [startPage, startPage + 1, startPage + 2];

      // параметры фильтров для discover-запроса;
      // жанры и страны через "|" означают «любой из выбранных» (ИЛИ)
      const params: Record<string, string> = {};
      if (selectedGenres.length > 0)
        params.with_genres = selectedGenres.join("|");
      if (selectedCountries.length > 0)
        params.with_origin_country = selectedCountries.join("|");
      if (selectedRuntime.min !== null)
        params["with_runtime.gte"] = String(selectedRuntime.min);
      if (selectedRuntime.max !== null)
        params["with_runtime.lte"] = String(selectedRuntime.max);
      // рейтинг учитываем только у фильмов минимум со 100 голосами
      if (selectedRating.min !== null) {
        params["vote_average.gte"] = String(selectedRating.min);
        params["vote_count.gte"] = "100";
      }

      // есть ли хоть один активный фильтр
      const hasFilters =
        selectedGenres.length > 0 ||
        selectedCountries.length > 0 ||
        selectedRuntime.min !== null ||
        selectedRuntime.max !== null ||
        selectedRating.min !== null ||
        selectedYears.length > 0;
      // без фильтров показываем популярные фильмы, с фильтрами — поиск discover
      const path = hasFilters ? "/discover/movie" : "/movie/popular";
      if (!hasFilters) params.language = "en-US";

      // один запрос одной страницы (и, при необходимости, одного года)
      const load = (page: number, year?: number) =>
        tmdbFetch<MoviePage>(
          path,
          { ...params, page, primary_release_year: year },
          signal,
        );

      try {
        // с выбранными годами — по 3 страницы на каждый год (фильтр primary_release_year принимает один год),
        // без годов — просто 3 страницы
        const requests: Promise<MoviePage>[] =
          selectedYears.length > 0
            ? selectedYears.flatMap((year) =>
                pages.map((page) => load(page, year)),
              )
            : pages.map((page) => load(page));

        // ждём все запросы; allSettled не падает, если часть запросов завершилась ошибкой
        const settled = await Promise.allSettled(requests);
        if (signal.aborted) return; // пока ждали, эффект уже перезапустился

        const moviePages: MoviePage[] = settled
          .filter(
            (res): res is PromiseFulfilledResult<MoviePage> =>
              res.status === "fulfilled",
          )
          .map((res) => res.value);

        // упали ВСЕ запросы — это ошибка, а не «ничего не найдено»
        if (moviePages.length === 0) {
          const failed = settled.find(
            (res): res is PromiseRejectedResult => res.status === "rejected",
          );
          throw failed?.reason ?? new Error("Request failed");
        }

        // Группируем по годам явно через slice
        // год 0: moviePages[0,1,2], год 1: moviePages[3,4,5] и тд
        const perYear = Math.floor(60 / (selectedYears.length || 1));

        // с годами: для каждого года берём его 3 страницы, склеиваем и обрезаем до perYear;
        // без годов: склеиваем все страницы; в обоих случаях максимум 60 фильмов
        const allMovies =
          selectedYears.length > 0
            ? selectedYears
                .flatMap(
                  (_, i) =>
                    moviePages
                      .slice(i * 3, i * 3 + 3) // берём 3 страницы этого года
                      .flatMap((page) => page.results) // объединяем результаты
                      .slice(0, perYear), // берём нужное количество
                )
                .slice(0, 60)
            : moviePages.flatMap((page) => page.results).slice(0, 60);

        // «общее число фильмов» для плашки «There are N films»
        const total = countTotalResults(moviePages);

        // текущая группа покрывает страницы TMDB до currentGroup * 3 включительно;
        // следующая есть, если хотя бы у одного запроса страниц больше
        const hasNext = moviePages.some(
          (page) => page.total_pages > currentGroup * 3,
        );

        setMovieResult(allMovies);
        setTotalResults(total);
        setHasNextPage(hasNext);
      } catch (err) {
        // Отмена запроса — штатная ситуация, пользователю её не показываем.
        if (!isAbortError(err)) setError(errorMessage(err));
      } finally {
        // После отмены состоянием loading уже управляет новый запуск эффекта;
        // сброс здесь вызвал бы мигание индикатора.
        if (!signal.aborted) setLoading(false);
      }
    }

    loadMovies();

    // Cleanup: при смене id/reviewPage или размонтировании отменяем
    // устаревшие запросы, чтобы их ответы не перезаписали актуальные данные.
    return () => ctrl.abort();
  }, [
    currentGroup,
    selectedGenres,
    selectedCountries,
    selectedRuntime,
    selectedYears,
    selectedRating,
  ]);

  return { movieResult, loading, error, totalResults, hasNextPage };
}
