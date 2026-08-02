import { useState } from "react";
import Dropdown from "./Dropdown";
import { useMovies } from "../hooks/useMovies";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "./SiteHeader";

const sort = ["GENRE", "COUNTRY", "RUNTIME", "Find by year", "Find by rating"];

export default function MainPage() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedRuntime, setSelectedRuntime] = useState({
    label: "Any",
    min: null,
    max: null,
  });
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedRating, setSelectedRating] = useState({
    label: "Any",
    min: null,
    max: null,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const currentGroup = Number(searchParams.get("page")) || 1;
  const navigate = useNavigate();

  const {
    movieResult,
    loading: moviesLoading,
    error: moviesError,
    totalResults,
  } = useMovies({
    currentGroup,
    selectedGenres,
    selectedCountries,
    selectedRuntime,
    selectedYears,
    selectedRating,
  });

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
    setSearchParams({ page: 1 });
  };

  const handleYearChange = (year) => {
    setSelectedYears(year);
    setSearchParams({ page: 1 });
  };

  const handleRuntimeChange = (runtime) => {
    setSelectedRuntime(runtime);
    setSearchParams({ page: 1 });
  };

  const handleCountryChange = (country) => {
    setSelectedCountries(country);
    setSearchParams({ page: 1 });
  };

  const handleGenreChange = (genres) => {
    setSelectedGenres(genres);
    setSearchParams({ page: 1 });
  };

  return (
    <>
      <Header info={"main"} />
      <main className="py-8">
        <div className="container">
          <div className="pb-3.75">
            <div className="flex justify-between text-[#99aabb] pb-1 max-[600px]:flex-wrap max-[600px]:justify-center">
              <h2 className="max-[600px]:hidden">FILMS</h2>
              <div className="flex items-center gap-5 max-[540px]:flex-col">
                {sort.map((type) => {
                  return (
                    <Dropdown
                      key={type}
                      sortType={type}
                      selectedGenres={selectedGenres}
                      onGenreChange={handleGenreChange}
                      selectedCountries={selectedCountries}
                      onCountryChange={handleCountryChange}
                      selectedRuntime={selectedRuntime}
                      onRuntimeChange={handleRuntimeChange}
                      selectedYears={selectedYears}
                      onYearChange={handleYearChange}
                      selectedRating={selectedRating}
                      onRatingChange={handleRatingChange}
                    />
                  );
                })}
              </div>
            </div>
            <div className="border-b text-[#7b7f83]"></div>
          </div>
          {movieResult.length > 0 && totalResults && (
            <div className="w-full h-10 bg-[#545f6a] rounded-sm py-2.5 px-8 text-[#99aabb]">
              <p className="flex justify-center">
                There are {Number(totalResults).toLocaleString("en-EN")} films.
              </p>
            </div>
          )}
          <div className="pt-2.5 pb-3.75">
            {moviesError && (
              <p className="text-center text-red-400">{moviesError}</p>
            )}

            {movieResult.length > 0 ? (
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(76px,1fr))] gap-4">
                {movieResult.map((movie, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="group relative cursor-pointer h-28.75"
                    >
                      <img
                        className="w-full h-full object-cover rounded-sm border border-gray-700"
                        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                      />

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-200 rounded-sm"></div>

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
                            ★ {movie.vote_average.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              !moviesLoading &&
              (!movieResult && (
                <div className="text-center text-base font-bold text-amber-500">
                  Movies not found...
                </div>
              ))
            )}
            {moviesLoading && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full border-3 border-gray-700 border-t-lime-500 animate-spin" />
              </div>
            )}
          </div>
          <div className="border-b text-[#7b7f83]"></div>
          <div
            className={`flex ${currentGroup > 1 ? "justify-between" : "justify-end"} pt-2.5`}
          >
            {currentGroup > 1 && (
              <button
                onClick={() => setSearchParams({ page: currentGroup - 1 })}
                className="bg-[#283038] text-[#99AABB] py-2.25 px-3.75 rounded-sm"
              >
                Previous
              </button>
            )}
            {movieResult.length > 20 && (
              <button
                onClick={() => setSearchParams({ page: currentGroup + 1 })}
                className="bg-[#283038] text-[#99AABB] py-2.25 px-3.75 rounded-sm"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}