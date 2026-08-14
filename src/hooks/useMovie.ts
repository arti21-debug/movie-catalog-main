import { Movie, Provider } from "@/types/tmdb";
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

  useEffect(() => {
    if (movie?.title && movie?.release_date) {
      document.title = `${movie.title} (${movie.release_date.slice(0, 4)}) — Filmbox`;
    }

    return () => {
      document.title = "Filmbox";
    };
  }, [movie?.title, movie?.release_date]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

  const filteredProviders: Provider[] = countryProviders
  ? [
    ...new Map(
      (["flatrate", "rent", "buy"] as const)
      .flatMap((key) => countryProviders[key] ?? [])
      .map((prov) => [prov.provider_id, prov]),
    ).values(),
  ] : [];

  useEffect(() => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    };

    async function getMovie() {
      setLoading(true);

      try {
        const request = fetch(
          `https://api.themoviedb.org/3/movie/${id}?append_to_response=watch/providers,credits,videos,images,release_dates,similar`,
          {
            headers,
          },
        ).then((res) => {
          if (!res.ok) throw new Error("Ошибка запроса");
          return res.json();
        });

        const reviewsRequest = fetch(
          `https://api.themoviedb.org/3/movie/${id}/reviews?page=${reviewPage}`,
          {
            headers,
          },
        ).then((res) => {
          if (!res.ok) throw new Error("Ошибка запроса");
          return res.json();
        });

        const [movieData, reviewsData] = await Promise.all([
          request,
          reviewsRequest,
        ]);

        setMovie({
          ...movieData,
          reviews: reviewsData,
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    getMovie();
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