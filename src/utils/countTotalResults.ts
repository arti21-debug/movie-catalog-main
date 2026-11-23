import { MoviePage } from "@/types/tmdb";

export function countTotalResults(
  moviePages: Pick<MoviePage, "total_results">[],
): number {
  return moviePages
    .filter((_, i) => i % 3 === 0)
    .reduce((acc, page) => acc + page.total_results, 0);
}
