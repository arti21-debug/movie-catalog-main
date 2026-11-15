import { BackdropImage, Movie } from "@/types/tmdb";

// готовит слайды для карусели: берёт первые кадры (backdrops) фильма
// и группирует их по парам, потому что в слайде две картинки
export function getCarouselSlides(movie: Movie | null) {
  // первые кадры: индексы 0–10, то есть до 11 штук;
  // ?? [] защищает от случая, когда фильм ещё не загружен или у него нет картинок
  const firstBackdrops =
    movie?.images?.backdrops.filter((_, i) => i <= 10) ?? [];

  // нарезаем на пары: [0,1], [2,3], [4,5], ...
  // условие i < length - 1 означает, что последний кадр без пары отбрасывается,
  // чтобы в слайде не оказалось одной картинки
  const slides: BackdropImage[][] = [];
  for (let i = 0; i < firstBackdrops.length - 1; i += 2) {
    slides.push(firstBackdrops.slice(i, i + 2));
  }

  return { slides };
}