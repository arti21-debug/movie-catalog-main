import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export function useMovie({ allReviewsShow, reviewPage }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const firstSimilar = movie?.similar?.results.filter((_, i) => i < 6) ?? [];

  // получаем массив количества страниц
  const reviewsPagesNum = movie?.reviews?.total_pages;
  let reviewsPages = [];
  for (let i = 1; i <= reviewsPagesNum; i++) {
    reviewsPages.push(i);
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

  // развертываем ключи провайдеров и отсеиваем мусор
  const allProviders = countryProviders
    ? Object.values(countryProviders)
        .flat()
        .filter((prov) => prov.provider_id)
    : [];

  // исключаем дубли провайдеров из соседних ключей, после flat
  const filteredProviders = [
    ...new Map(allProviders.map((prov) => [prov.provider_id, prov])).values(),
  ];

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
        setError(err.message);
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
