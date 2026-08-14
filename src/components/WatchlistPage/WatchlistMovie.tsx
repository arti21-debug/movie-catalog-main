import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Movie from "../Movie";
import { Check, Heart, X } from "lucide-react";
import { WatchlistMovie } from "@/types/tmdb";

interface WatchlistMovieProps {
  movie: WatchlistMovie;
  isHide: boolean;
  cutedText: string;
  watchlist: WatchlistMovie[];
}

export default function WatchlistMovie({
  movie,
  isHide,
  cutedText,
  watchlist,
}: WatchlistMovieProps) {
  const [isOverviewHidden, setIsOverviewHidden] = useState(true);
  const navigate = useNavigate();
  const status = watchlist.find((m) => m.id === movie.id)?.status ?? null;

  return (
    <>
      <div className="flex gap-6 max-[600px]:flex-col">
        <div
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="group relative h-30 w-20 cursor-pointer max-[600px]:h-auto max-[600px]:w-30"
          aria-label="open movie"
        >
          <Movie movie={movie} />
        </div>
        <div className="flex max-w-145 flex-col gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(`/movie/${movie.id}`)}>
              <h2 className="font-serifTitle text-xl font-bold text-white transition duration-200 hover:text-emerald-600">
                {movie.title}
              </h2>
            </button>
            <div className="text-lg">{movie?.release_date?.slice(0, 4)}</div>
            <div className="group relative">
              {status === "watched" && (
                <Check
                  color="#4ec200"
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}
              {status === "want" && (
                <Heart
                  color="#beb927"
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}
              {status === "dropped" && (
                <X
                  color="#ed0707"
                  size={20}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
              )}
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 rounded bg-gray-950/80 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {status === "want"
                  ? "Liked"
                  : status
                    ? status[0].toUpperCase() + status.slice(1)
                    : ""}
              </span>
            </div>
          </div>
          <div className="flex max-w-[clamp(25rem,20.909rem+20.45vw,36.25rem)] flex-col gap-4">
            {isHide && isOverviewHidden ? (
              <div>
                {cutedText}{" "}
                <button
                  onClick={() => setIsOverviewHidden(false)}
                  className="mt-1 ml-1 rounded-sm border-white/10 bg-[#283038] px-2 py-0 text-sm transition duration-200 hover:bg-gray-700 hover:text-gray-200"
                  aria-label="show full review"
                >
                  •••
                </button>
              </div>
            ) : (
              <p>{movie.overview}</p>
            )}
          </div>
        </div>
      </div>
      <div className="border-b pt-4 text-[#7b7f83]"></div>
    </>
  );
}