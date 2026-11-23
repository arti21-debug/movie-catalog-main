import { errorMessage, isAbortError, tmdbFetch } from "@/lib/tmdb";
import { SearchedMovie } from "@/types/tmdb";
import { useEffect, useRef, useState } from "react";

interface Search {
  query: string;
  currentPage: number;
}

// запись из crew, среди которых ищем режиссёра
interface DirectorCandidate {
  job: string;
  name: string;
  id: number;
  department: string;
}

// хук поиска фильмов: ищет по названию, подгружает страницы по мере роста currentPage
export function useSearch({ query, currentPage }: Search) {
  const [searchResult, setSearchResult] = useState<SearchedMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  // флаг «первая загрузка для этого запроса выполнена»:
  // пока он пуст, загружаем все страницы с 1 до currentPage (например, если пользователь
  // вернулся на страницу с ?page=3), после — догружаем только новую страницу
  const effectRef = useRef<true | null>(null);
  // запрос, для которого сейчас накоплены результаты; по нему видно, что запрос сменился
  const queryRef = useRef<string | null>(null);

  useEffect(() => {
    if (query) {
      document.title = `Search: ${query} — Filmbox`;
    }
  }, [query]);

  useEffect(() => {
    if (!query) return;

    const ctrl = new AbortController();
    const { signal } = ctrl;

    // запрос сменился: сбрасываем флаг, чтобы результаты собрались заново
    if (queryRef.current !== query) {
      effectRef.current = null;
      queryRef.current = query;
    }

    // загружает страницу поиска и для каждого фильма отдельным запросом
    // получает съёмочную группу, чтобы найти режиссёра
    async function loadPage(
      page: number,
    ): Promise<{ movies: SearchedMovie[]; totalPages: number }> {
      const data = await tmdbFetch<{
        results: SearchedMovie[];
        total_pages: number;
      }>("/search/movie", { query, page }, signal);

      // запросы по всем фильмам страницы идут параллельно
      const movies = await Promise.all(
        data.results.map(async (movie) => {
          // сбой credits одного фильма не должен ронять всю страницу результатов
          const credits = await tmdbFetch<{ crew?: DirectorCandidate[] }>(
            `/movie/${movie.id}/credits`,
            {},
            signal,
          ).catch((err) => {
            if (isAbortError(err)) throw err; // пробрасываем дальше, чтобы остановить всю цепочку.
            return null;
          });

          // режиссёр — первый человек из crew с должностью "Director"
          const director = credits?.crew?.find((p) => p.job === "Director");

          // добавляем к фильму имя режиссёра, его id и отдел
          return {
            ...movie,
            director: director?.name,
            crewId: director?.id,
            crewDepartment: director?.department,
          };
        }),
      );

      return { movies, totalPages: data.total_pages };
    }

    async function getMovies() {
      setLoading(true);
      setError(null); // сбрасываем ошибку прошлой попытки

      try {
        if (effectRef.current) {
          // запрос не менялся и первая загрузка уже была: берём только текущую страницу
          const { movies: moviesWithCredits, totalPages: pages } =
            await loadPage(currentPage);
          if (signal.aborted) return; // пока ждали, эффект уже перезапустился
          setTotalPages(pages);

          // на первой странице список заменяем, на остальных — дописываем в конец
          setSearchResult((movies) =>
            currentPage === 1
              ? [...moviesWithCredits]
              : [...movies, ...moviesWithCredits],
          );
        } else {
          // первая загрузка для этого запроса: последовательно собираем
          // все страницы от 1 до currentPage
          const searched: SearchedMovie[] = [];
          let pages = 0;
          for (let i = 1; i <= currentPage; i++) {
            const page = await loadPage(i);
            searched.push(...page.movies);
            pages = page.totalPages; // значение с последней загруженной страницы
          }
          if (signal.aborted) return;
          setSearchResult(searched);
          setTotalPages(pages);
        }

        // с этого момента при росте currentPage догружаем только новую страницу
        effectRef.current = true;
      } catch (err) {
        // Отмена запроса — штатная ситуация, пользователю её не показываем.
        if (!isAbortError(err)) setError(errorMessage(err));
      } finally {
        // После отмены состоянием loading уже управляет новый запуск эффекта;
        // сброс здесь вызвал бы мигание индикатора.
        if (!signal.aborted) setLoading(false);
      }
    }

    getMovies();

    // Cleanup: при смене id/reviewPage или размонтировании отменяем
    // устаревшие запросы, чтобы их ответы не перезаписали актуальные данные.
    return () => ctrl.abort();
  }, [query, currentPage]);

  return { searchResult, loading, error, totalPages };
}
