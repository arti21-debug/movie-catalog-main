import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchedMovie({ movie, isHide, cutedText }) {
  const [isOverviewHidden, setIsOverviewHidden] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex gap-6 max-[600px]:flex-col">
        <div
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="relative group w-20 h-30 max-[600px]:max-w-32 max-[600px]:h-auto cursor-pointer"
          aria-label="open movie"
        >
          <img
            className="w-full aspect-2/3 object-cover rounded-sm border border-gray-700 
               transition-opacity duration-200 group-hover:opacity-40"
            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
          />

          {/* Зелёный outline через псевдоэлемент на li */}
          <div
            className="absolute inset-0 rounded-sm border-2 border-transparent 
                  group-hover:border-green-500 transition-colors duration-200 pointer-events-none"
          />

          {/* Тултип снизу — не уйдёт за экран */}
          <div
            className="absolute left-0 right-0 bottom-0 
                  bg-gradient-to-t from-black/90 to-transparent
                  px-1.5 py-2 rounded-b-sm
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200"
          >
            <p className="text-white text-[11px] font-medium leading-tight truncate">
              {movie.title}
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-gray-400 text-[10px]">
                {movie.release_date?.slice(0, 4)}
              </span>
              <span className="text-green-400 text-[10px] font-medium">
                ★ {movie?.vote_average?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 max-w-145">
          <div className="flex items-center gap-4 max-[600px]:flex-col max-[600px]:items-start">
            <button onClick={() => navigate(`/movie/${movie.id}`)}>
              <h2 className="font-serifTitle text-xl font-bold text-white hover:text-emerald-600 transition duration-200">
                {movie.title}
              </h2>
            </button>
            <div className="text-lg">{movie?.release_date?.slice(0, 4)}</div>
          </div>
          <div className="flex flex-col gap-4 max-w-[clamp(25rem,20.909rem+20.45vw,36.25rem)]">
            {isHide && isOverviewHidden ? (
              <div>
                {cutedText}{" "}
                <button
                  onClick={() => setIsOverviewHidden(false)}
                  className="mt-1 ml-1 px-2 py-0 bg-[#283038] rounded-sm text-sm border-white/10 hover:text-gray-200 hover:bg-gray-700 transition duration-200"
                  aria-label="show full review"
                >
                  •••
                </button>
              </div>
            ) : (
              <p>{movie.overview}</p>
            )}
            {movie.director && (
              <div className="text-sm">
                Directed by{" "}
                <button
                  onClick={() =>
                    navigate(
                      `/person/${movie.crewId}?department=${movie.crewDepartment}`,
                    )
                  }
                  className="grey-button ml-2"
                >
                  {movie.director}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="border-b text-[#7b7f83] pt-4"></div>
    </>
  );
}