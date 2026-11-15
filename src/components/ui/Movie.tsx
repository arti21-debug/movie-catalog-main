import { Movie, MovieCardData } from "@/types/tmdb";
import { useWatchlistStore } from "../../store/useWatchlistStore";
import { Check, Heart, X } from "lucide-react";

interface MovieProp {
  movie: MovieCardData;
}

export default function Movie({ movie }: MovieProp) {
  const watchList = useWatchlistStore((state) => state.watchlist);
  const status = watchList?.find((m) => m.id === movie?.id)?.status ?? null;

  return (
    <>
      {movie.poster_path ? (
        <img
          className="h-full w-full rounded-sm border border-gray-700 object-cover"
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-sm border border-gray-700 bg-[#283038] p-1 text-center text-[10px] text-gray-400">
          {movie.title}
        </div>
      )}

      <div className="absolute inset-0 rounded-sm bg-black/0 transition-colors duration-200 group-hover:bg-black/60"></div>

      {/* Зелёный outline через псевдоэлемент на li */}
      <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-transparent transition-colors duration-200 group-hover:border-green-500" />

      <div className="absolute top-0 right-0 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {status === "watched" && <Check color="#4ec200" size={20} />}
        {status === "want" && <Heart color="#beb927" size={20} />}
        {status === "dropped" && <X color="#ed0707" size={20} />}
      </div>
      {/* Тултип снизу — не уйдёт за экран */}
      <div className="absolute right-0 bottom-0 left-0 rounded-b-sm bg-linear-to-t from-black/90 to-transparent px-1.5 py-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <p className="truncate text-[11px] leading-tight font-medium text-white">
          {movie.title}
        </p>
        <div className="mt-0.5 flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            {movie.release_date?.slice(0, 4)}
          </span>
          <span className="text-[10px] font-medium text-green-400">
            ★ {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </>
  );
}
