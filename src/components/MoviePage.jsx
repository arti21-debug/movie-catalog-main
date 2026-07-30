import Header from "./SiteHeader.jsx";
import { useMovie } from "../hooks/useMovie.js";
import { useState } from "react";
import Trailer from "./TrailerModal.jsx";
import Carousel from "./Carousel.jsx";
import { Review } from "./Review.jsx";
import { useNavigate } from "react-router-dom";
import PosterSection from "./PosterSection.jsx";
import Cast from "./MovieCredits/Cast.jsx";
import Crew from "./MovieCredits/Crew.jsx";
import Details from "./MovieCredits/Details.jsx";
import Genres from "./MovieCredits/Genres.jsx";
import Releases from "./MovieCredits/Releases.jsx";

export default function MoviePage({ setQuery }) {
  const [activeInfo, setActiveInfo] = useState("CAST");
  const [allReviewsShow, setAllReviewsShow] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const navigate = useNavigate();

  const {
    movie,
    filteredProviders,
    error: movieError,
    loading: movieLoading,
    trailerKey,
    trailerName,
    reviews,
    reviewsPages,
    firstSimilar,
  } = useMovie({ allReviewsShow, reviewPage });

  return (
    <div className="bg-[#14181C] text-[#99AABB]">
      {console.log(movie)}
      <div className="relative h-140 max-[600px]:h-80">
        <div
          className="absolute inset-0 bg-cover bg-center h-full"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${movie?.backdrop_path})`,
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#14181C]" />
        </div>
        <Header setQuery={setQuery} info={"movie"} />
      </div>
      <main className="relative -top-8">
        <div className="container flex justify-baseline gap-10">
          <div className="max-[600px]:hidden">
            <PosterSection
              movie={movie}
              filteredProviders={filteredProviders}
            />
            <Trailer trailerKey={trailerKey} trailerName={trailerName} />
          </div>

          <div className="max-w-167.5">
            <div className="flex items-start gap-8">
              <div className="hidden max-[600px]:block">
                <PosterSection
                  movie={movie}
                  filteredProviders={filteredProviders}
                />
                <Trailer trailerKey={trailerKey} trailerName={trailerName} />
              </div>
              <div className="flex flex-col gap-3 max-w-97.5">
                <h2 className="font-serifTitle font-bold text-[clamp(1.625rem,1.4643rem+0.7143vw,2rem)] text-white">
                  {movie?.title}
                </h2>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap gap-2 font-sans text-base">
                    <div className="flex gap-3 text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]">
                      <span className="text-[#DDEEFF]">
                        {movie?.release_date?.slice(0, 4)}
                      </span>
                      <span>Origin countries:</span>
                    </div>
                    {movie?.origin_country?.map((c, index) => (
                      <span
                        key={index}
                        className="text-[#DDEEFF] text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]"
                      >
                        {c}
                        {index === movie?.origin_country.length - 1 ? "" : ", "}
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-sm">{movie?.tagline}</p>
                </div>
                <p className="font-text text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]">
                  {movie?.overview}
                </p>
              </div>
              <div className="font-sans flex flex-col items-center max-[880px]:hidden">
                <div className="flex items-center gap-20">
                  <h3 className="text-sm">RATINGS</h3>
                  <p className="text-xs text-nowrap">
                    {movie?.vote_count} FANS
                  </p>
                </div>
                <div className="pt-1 border-b w-full"></div>
                <div className="pt-3 flex justify-center text-xl">
                  {movie?.vote_average?.toFixed(1)}
                </div>

                <div className="relative inline-block w-fit">
                  {/* Серые звёзды — фон */}
                  <span className="text-gray-500 text-xl tracking-wider">
                    ★★★★★
                  </span>

                  {/* div обрезает, внутри жёлтые звёзды */}
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{
                      width: `${((movie?.vote_average ?? 0) / 10) * 100}%`,
                    }}
                  >
                    <span className="text-yellow-400 text-xl tracking-wider whitespace-nowrap">
                      ★★★★★
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="font-inter w-[clamp(18.75rem, 16.705rem + 10.23vw, 24.375rem)] max-w-97.5">
              <header className="flex flex-wrap gap-5 pt-10">
                {["CAST", "CREW", "DETAILS", "GENRES", "RELEASES"].map((s) => (
                  <button
                    onClick={() => setActiveInfo(s)}
                    key={s}
                    className={`${activeInfo === s ? "text-white" : "text-green-500 hover:text-white"} relative text-sm`}
                  >
                    {s}

                    {activeInfo === s && (
                      <span className="absolute bottom-0 left-0 w-full h-px bg-white" />
                    )}
                    <div className="pt-1 border-b text-[#283038]"></div>
                  </button>
                ))}
              </header>
              {activeInfo === "CAST" && <Cast movie={movie} />}
              {activeInfo === "CREW" && <Crew movie={movie} />}
              {activeInfo === "DETAILS" && <Details movie={movie} />}
              {activeInfo === "GENRES" && <Genres movie={movie} />}
              {activeInfo === "RELEASES" && <Releases movie={movie} />}
            </div>
          </div>
        </div>
        <section>
          <div className="container">
            <Carousel movie={movie} />
            {reviews.length > 0 && (
              <div className="mt-20">
                <h2 className="font-serifTitle text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)] tracking-wider">
                  REVIEWS
                </h2>
                <div className="mt-1 border-b text-[#283038]"></div>
                <div className="mt-6 flex flex-col gap-16">
                  {reviews.map((user) => (
                    <Review key={user.id} user={user} />
                  ))}
                </div>
                <div className="flex justify-center">
                  {!allReviewsShow && movie?.reviews?.results.length > 5 && (
                    <button
                      onClick={() => setAllReviewsShow(true)}
                      className="mt-8 bg-[#283038] whitespace-nowrap rounded-sm border-t border-white/10 hover:text-gray-200 hover:bg-gray-700"
                      style={{
                        padding:
                          "clamp(0.125rem, 0.1rem + 0.125vw, 0.25rem) clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem)",
                        fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
                      }}
                    >
                      Show all reviews
                    </button>
                  )}
                  {allReviewsShow && (
                    <button
                      onClick={() => setAllReviewsShow(false)}
                      className="mt-8 bg-[#283038] whitespace-nowrap rounded-sm border-t border-white/10 hover:text-gray-200 hover:bg-gray-700"
                      style={{
                        padding:
                          "clamp(0.125rem, 0.1rem + 0.125vw, 0.25rem) clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem)",
                        fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
                      }}
                    >
                      Hide all reviews
                    </button>
                  )}
                </div>
                <div className="flex justify-center gap-3 mt-6">
                  {reviewsPages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setReviewPage(page)}
                      className="px-1.5 bg-[#283038] whitespace-nowrap rounded-sm border-t border-white/10 hover:text-gray-200 hover:bg-gray-700"
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {firstSimilar.length > 0 && (
              <div className="mt-20">
                <h2 className="font-serifTitle text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)] tracking-wider">
                  SIMILAR FILMS
                </h2>
                <div className="mt-1 border-b text-[#283038]"></div>
                <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-3">
                  {firstSimilar.map((film) => (
                    <button
                      key={film.id}
                      onClick={() => navigate(`/movie/${film.id}`)}
                    >
                      <img
                        className="w-full aspect-2/3 rounded-sm border border-gray-700 hover:border-gray-300 transition duration-500"
                        src={`https://image.tmdb.org/t/p/w342${film.poster_path}`}
                        alt={film.title}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}