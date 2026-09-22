import Header from "../ui/SiteHeader";
import { useMovie } from "../../hooks/useMovie.js";
import { useState } from "react";
import Trailer from "./TrailerModal.js";
import Carousel from "./Carousel.js";
import { Review } from "./Review.js";
import { useNavigate } from "react-router-dom";
import PosterSection from "./PosterSection.js";
import Cast from "./MovieCredits/Cast.js";
import Crew from "./MovieCredits/Crew.js";
import Details from "./MovieCredits/Details.js";
import Genres from "./MovieCredits/Genres.js";
import Releases from "./MovieCredits/Releases.js";
import RatingSection from "./RatingSection.js";

export default function MoviePage() {
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

  if (movieLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#14181C]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-lime-500" />
      </div>
    );

  if (movieError)
    return (
      <div className="flex h-screen items-center justify-center bg-[#14181C] text-red-400">
        {movieError}
      </div>
    );

    if (!movie) return null;

  return (
    <div className="bg-[#14181C] text-[#99AABB]">
      <div className="relative h-140 max-[600px]:h-80">
        <div
          className="absolute inset-0 h-full bg-cover bg-center"
          style={{
            backgroundImage: movie.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              : "none",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#14181C]" />
        </div>
        <Header info={"movie"} />
      </div>
      <main className="relative -top-8">
        <div className="container flex justify-center gap-10">
          <div className="max-[600px]:hidden">
            <PosterSection
              movie={movie}
              filteredProviders={filteredProviders}
            />
            <Trailer trailerKey={trailerKey} trailerName={trailerName} />
          </div>

          <div className="flex max-w-167.5 flex-col max-[600px]:items-center">
            <div className="flex items-start gap-8">
              <div className="hidden max-[600px]:block">
                <PosterSection
                  movie={movie}
                  filteredProviders={filteredProviders}
                />
                <Trailer trailerKey={trailerKey} trailerName={trailerName} />
              </div>
              <div className="flex max-w-97.5 flex-col gap-3">
                <h2 className="font-serifTitle text-[clamp(1.625rem,1.4643rem+0.7143vw,2rem)] font-bold text-white">
                  {movie.title}
                </h2>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-wrap gap-2 font-sans text-base">
                    <div className="flex gap-3 text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]">
                      <span className="text-[#DDEEFF]">
                        {movie?.release_date.slice(0, 4)}
                      </span>
                      <span>Origin countries:</span>
                    </div>
                    {movie.origin_country.map((c, index) => (
                      <span
                        key={c}
                        className="text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)] text-[#DDEEFF]"
                      >
                        {c}
                        {index === movie.origin_country.length - 1 ? "" : ", "}
                      </span>
                    ))}
                  </div>
                  <p className="font-sans text-sm">{movie.tagline}</p>
                </div>
                <p className="font-text text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]">
                  {movie.overview}
                </p>
                <div className="hidden max-[880px]:m-8 max-[880px]:block max-[550px]:hidden">
                  <RatingSection movie={movie} info={"adapt"} />
                </div>
              </div>
              <div className="max-[880px]:hidden">
                <RatingSection movie={movie} info={"adapt"} />
              </div>
            </div>
            <div className="font-inter w-[clamp(18.75rem, 16.705rem + 10.23vw, 24.375rem)] max-w-97.5">
              <div className="hidden max-[550px]:m-10 max-[550px]:block">
                <RatingSection movie={movie} info={"main"} />
              </div>
              <header className="flex flex-wrap gap-5 pt-10">
                {["CAST", "CREW", "DETAILS", "GENRES", "RELEASES"].map((s) => (
                  <button
                    onClick={() => setActiveInfo(s)}
                    key={s}
                    className={`${activeInfo === s ? "text-white" : "text-green-500 hover:text-white"} relative text-sm`}
                  >
                    {s}

                    {activeInfo === s && (
                      <span className="absolute bottom-0 left-0 h-px w-full bg-white" />
                    )}
                    <div className="border-b pt-1 text-[#283038]"></div>
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
                  {!allReviewsShow && movie.reviews && movie.reviews.results.length > 5 && (
                    <button
                      onClick={() => setAllReviewsShow(true)}
                      className="mt-8 rounded-sm border-t border-white/10 bg-[#283038] whitespace-nowrap transition duration-200 hover:bg-gray-700 hover:text-gray-200"
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
                      className="mt-8 rounded-sm border-t border-white/10 bg-[#283038] whitespace-nowrap hover:bg-gray-700 hover:text-gray-200"
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
                <div className="mt-6 flex justify-center gap-3">
                  {reviewsPages.map((page) => (
                    <button
                      key={page}
                      onClick={() => setReviewPage(page)}
                      className="rounded-sm border-t border-white/10 bg-[#283038] px-1.5 whitespace-nowrap hover:bg-gray-700 hover:text-gray-200"
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
                        className="aspect-2/3 w-full rounded-sm border border-gray-700 transition duration-500 hover:border-gray-300"
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
