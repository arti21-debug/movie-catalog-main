import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Movie from "../ui/Movie";
import { SearchedMovie } from "@/types/tmdb";

interface SearchedMovieProps {
  movie: SearchedMovie;
  isHide: boolean;
  cutedText: string;
}

export default function SearchedMovie({ movie, isHide, cutedText }: SearchedMovieProps) {
  const [isOverviewHidden, setIsOverviewHidden] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className="flex gap-6 max-[600px]:flex-col">
        <div
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="group relative h-30 w-20 cursor-pointer max-[600px]:h-auto max-[600px]:max-w-32"
          aria-label="open movie"
        >
          <Movie movie={movie} />
        </div>
        <div className="flex max-w-145 flex-col gap-4">
          <div className="flex items-center gap-4 max-[600px]:flex-col max-[600px]:items-start">
            <button onClick={() => navigate(`/movie/${movie.id}`)}>
              <h2 className="font-serifTitle text-xl font-bold text-white transition duration-200 hover:text-emerald-600">
                {movie.title}
              </h2>
            </button>
            <div className="text-lg">{movie?.release_date?.slice(0, 4)}</div>
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
            {movie.director && (
              <div className="text-sm">
                Directed by{" "}
                <button
                  onClick={() =>
                    navigate(
                      `/person/${movie.crewId}?department=${encodeURIComponent(movie.crewDepartment ?? "")}`,
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
      <div className="border-b pt-4 text-[#7b7f83]"></div>
    </>
  );
}