import { useWatchlistStore } from "@/store/useWatchlistStore.js";

export default function RatingSection({ movie, info }) {
  const watchList = useWatchlistStore((state) => state.watchlist);
  const addMovie = useWatchlistStore((state) => state.addMovie);
  const removeMovie = useWatchlistStore((state) => state.removeMovie);
  const movieStatus =
    watchList?.find((m) => m.id === movie?.id)?.status ?? null;

  return (
    <>
      <div className="flex flex-col items-center font-sans">
        <div className="flex items-center gap-20">
          <h3 className="text-sm">RATINGS</h3>
          <p className="text-xs text-nowrap">{movie?.vote_count} FANS</p>
        </div>
        <div className="w-full border-b pt-1"></div>
        <div className="flex justify-center pt-3 text-xl">
          {movie?.vote_average?.toFixed(1)}
        </div>

        <div className="relative inline-block w-fit">
          {/* Серые звёзды — фон */}
          <span className="text-xl tracking-wider text-gray-500">★★★★★</span>

          {/* div обрезает, внутри жёлтые звёзды */}
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: `${((movie?.vote_average ?? 0) / 10) * 100}%`,
            }}
          >
            <span className="text-xl tracking-wider whitespace-nowrap text-yellow-400">
              ★★★★★
            </span>
          </div>
        </div>
      </div>
      <div className="border-b pt-4"></div>
      <div
        className={`flex ${info === "main" ? "flex-col" : ""} flex-wrap items-center justify-center gap-2 pt-3`}
      >
        {[
          { status: "watched", label: "✓ Watched" },
          { status: "want", label: "♥ Want to watch" },
          { status: "dropped", label: "✕ Dropped" },
        ].map(({ status, label }) => (
          <button
            key={status}
            onClick={() => addMovie(movie, status)}
            className={`text-xs py-1.5 rounded-sm bg-[#283038] text-[#99aabb] border-t border-white/10 hover:bg-gray-700 transition-colors duration-200 w-[clamp(7.5rem,6.818rem+3.41vw,9.375rem)] ${
              movieStatus === status && status === "watched"
                ? "text-emerald-500 hover:text-emerald-500"
                : movieStatus === status && status === "want"
                  ? "text-amber-500"
                  : movieStatus === status && status === "dropped"
                    ? "text-red-500"
                    : "text-[#99aabb] hover:bg-gray-700 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
        {movieStatus && (
          <button
            onClick={() => removeMovie(movie?.id)}
            className="text-xs py-1.5 rounded-sm bg-[#283038] text-[#99aabb] border-t border-white/10 hover:bg-gray-700 hover:text-white transition-colors duration-200 w-[clamp(7.5rem,6.818rem+3.41vw,9.375rem)]"
          >
            Remove from list
          </button>
        )}
      </div>
    </>
  );
}