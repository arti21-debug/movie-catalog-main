import { errorMessage, isAbortError, tmdbFetch } from "@/lib/tmdb";
import { Movie, Provider, ReviewsResponse } from "@/types/tmdb";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Review {
  allReviewsShow: boolean;
  reviewPage: number;
}

export function useMovie({ allReviewsShow, reviewPage }: Review) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Movie | null>(null);

  const { id } = useParams();

  // заголовок вкладки: "Название (год) — Filmbox";
  // при уходе со страницы возвращаем обычный заголовок
  useEffect(() => {
    if (movie?.title && movie?.release_date) {
      document.title = `${movie.title} (${movie.release_date.slice(0, 4)}) — Filmbox`;
    }

    return () => {
      document.title = "Filmbox";
    };
  }, [movie?.title, movie?.release_date]);

  // при переходе на другой фильм прокручиваем страницу вверх
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // первые 6 похожих фильмов
  const firstSimilar = movie?.similar?.results.filter((_, i) => i < 6) ?? [];

  // получаем массив количества страниц
  const reviewsPagesNum = movie?.reviews?.total_pages;
  const reviewsPages: number[] = [];
  if (reviewsPagesNum !== undefined) {
    for (let i = 1; i <= reviewsPagesNum; i++) {
      reviewsPages.push(i);
    }
  }

  // первые отзывы под скрытое состояние
  const firstReviews = movie?.reviews?.results.filter((_, i) => i < 5);

  const reviews = allReviewsShow
    ? (movie?.reviews?.results ?? [])
    : (firstReviews ?? []);

  // поиск и выбор трейлера
  const trailer =
    movie?.videos?.results.find((video) => video.name === "Official Trailer") ||
    movie?.videos?.results.find((video) => video.type === "Trailer");
  const trailerKey = trailer?.key;
  const trailerName = trailer?.name;

  // получаем провайдеров фильмов и берем внутри объект US, если нету - первый в списке
  const providersData = movie?.["watch/providers"]?.results ?? {};
  const countryProviders = providersData.US ?? Object.values(providersData)[0];

  // объединяем подписку, аренду и покупку в один список без повторов:
  // Map по provider_id оставляет одну запись для сервиса, даже если он есть в нескольких категориях
  const filteredProviders: Provider[] = countryProviders
    ? [
        ...new Map(
          (["flatrate", "rent", "buy"] as const)
            .flatMap((key) => countryProviders[key] ?? [])
            .map((prov) => [prov.provider_id, prov]),
        ).values(),
      ]
    : [];

  // загрузка данных: срабатывает при смене фильма и при смене страницы отзывов
  useEffect(() => {
    if (!id) return;

    // Один контроллер на запуск эффекта: отменяет сразу оба запроса.
    const ctrl = new AbortController();
    // Индикатор загрузки включаем синхронно при старте запроса: это штатный сценарий
    // «эффект запускает fetch», а не вычисляемое значение, поэтому правило отключено точечно.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);

    Promise.all([
      // Фильм + доп. данные одним запросом (append_to_response в TMDB
      // подмешивает перечисленные ресурсы в основной ответ).
      tmdbFetch<Movie>(
        `/movie/${id}`,
        {
          append_to_response:
            "watch/providers,credits,videos,images,release_dates,similar",
        },
        ctrl.signal,
      ),
      // Отзывы грузятся отдельно: они постраничные (параметр page).
      tmdbFetch<ReviewsResponse>(
        `/movie/${id}/reviews`,
        { page: reviewPage },
        ctrl.signal,
      ),
    ])
      // Порядок результатов совпадает с порядком запросов в массиве.
      .then(([movieData, reviewsData]) =>
        setMovie({ ...movieData, reviews: reviewsData }),
      )
      .catch((err) => {
        // Отмена запроса — штатная ситуация, пользователю её не показываем.
        if (!isAbortError(err)) setError(errorMessage(err));
      })
      .finally(() => {
        // После отмены состоянием loading уже управляет новый запуск эффекта;
        // сброс здесь вызвал бы мигание индикатора.
        if (!ctrl.signal.aborted) setLoading(false);
      });

    // Cleanup: при смене id/reviewPage или размонтировании отменяем
    // устаревшие запросы, чтобы их ответы не перезаписали актуальные данные.
    return () => ctrl.abort();
  }, [id, reviewPage]);

  return {
    movie,
    filteredProviders,
    error,
    loading,
    trailerKey,
    trailerName,
    reviews,
    reviewsPages,
    firstSimilar,
  };
}
