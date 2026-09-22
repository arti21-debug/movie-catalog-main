import { BackdropImage, Movie } from "@/types/tmdb";

export function getCarouselSlides(movie: Movie | null) {
  const firstBackdrops =
    movie?.images?.backdrops.filter((_, i) => i <= 10) ?? [];

  const slides: BackdropImage[][] = [];
  for (let i = 0; i < firstBackdrops.length - 1; i += 2) {
    slides.push(firstBackdrops.slice(i, i + 2));
  }

  return { slides };
}