export function getCarouselSlides({ movie }) {
  const firstBackdrops =
    movie?.images?.backdrops.filter((img, i) => i <= 10) ?? [];

  const slides = [];
  for (let i = 0; i < firstBackdrops.length - 1; i += 2) {
    slides.push(firstBackdrops.slice(i, i + 2));
  }

  return { slides };
}