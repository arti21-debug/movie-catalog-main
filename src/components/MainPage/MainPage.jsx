import { useState } from "react";
import Dropdown from "./Dropdown";
import { useMovies } from "../../hooks/useMovies";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../SiteHeader";
import Movie from "../Movie";

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

  const uniqueMovies = [...new Map(movieResult.map((m) => [m.id, m])).values()];

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
            <div className="flex justify-between pb-1 text-[#99aabb] max-[600px]:flex-wrap max-[600px]:justify-center">
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
            <div className="h-10 w-full rounded-sm bg-[#545f6a] px-8 py-2.5 text-[#99aabb]">
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
              <ul className="grid grid-cols-[repeat(auto-fit,minmax(70px,1fr))] gap-4">
                {uniqueMovies.map((movie) => {
                  return (
                    <li
                      key={movie.id}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      className="group relative h-28.75 cursor-pointer"
                    >
                      <Movie movie={movie} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              !moviesLoading &&
              movieResult.length === 0 && (
                <div className="text-center text-base font-bold text-amber-500">
                  Movies not found...
                </div>
              )
            )}
            {moviesLoading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-lime-500" />
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
                className="rounded-sm bg-[#283038] px-3.75 py-2.25 text-[#99AABB]"
              >
                Previous
              </button>
            )}
            {movieResult.length > 20 && (
              <button
                onClick={() => setSearchParams({ page: currentGroup + 1 })}
                className="rounded-sm bg-[#283038] px-3.75 py-2.25 text-[#99AABB]"
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
