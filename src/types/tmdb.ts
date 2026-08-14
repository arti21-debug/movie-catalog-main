export interface ResultsReleases {
  results: MovieReleaseDates[];
}

export interface MovieReleaseDates {
  release_dates: ReleaseDate[];
  iso_3166_1: string;
}

export interface ReleaseDate {
  release_date: string;
}

export interface SpokenLanguages {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface ProductionCountries {
  iso_3166_1: string;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export interface SearchedMovie extends Movie {
  director: string | undefined;
  crewId: number | undefined;
  crewDepartment: string | undefined;
}

export interface PersonWithCredits extends Person {
  movie_credits: PersonMovieCredits;
}

export interface PersonMovieCredits {
  cast: MovieCredit[];
  crew: MovieCredit[];
}

export interface MovieCredit extends Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  character?: string;
  job?: string;
  department?: string;
  known_for_department?: string;
}

export interface RatingOption {
  label: string;
  min: number | null;
  max: number | null;
}

export interface RuntimeOption {
  label: string;
  min: number | null;
  max: number | null;
}

export interface MoviePage {
  results: Movie[];
  total_results: number;
  total_pages: number;
  page: number;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface CountryProviders {
  link: string;
  flatrate?: Provider[];
  rent?: Provider[];
  buy?: Provider[];
}

// Record<string, T> — это встроенный тип TS
// означает "объект с ключами-строками и значениями типа T"
// то есть { "US": CountryProviders, "GB": CountryProviders, ... }
interface WatchProviders {
  results: Record<string, CountryProviders>;
}

export interface VideosResponse {
  id: number;
  results: MovieVideo[];
}

export interface MovieVideo {
  iso_639_1: string | null;
  iso_3166_1: string | null;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface Review {
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  id: string;
  iso_639_1: string;
  media_id: number;
  media_title: string;
  media_type: "movie" | "tv";
  updated_at: string;
  url: string;
}

export interface ReviewsResponse {
  id: number;
  page: number;
  results: Review[];
  total_pages: number;
  total_results: number;
}

export interface SimilarMoviesResponse {
  page: number;
  results: SimilarMovie[];
  total_pages: number;
  total_results: number;
}

interface SimilarMovie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface WatchlistMovie extends Movie {
  status: WatchStatus;
}

export type WatchStatus = "watched" | "want" | "dropped";

export interface MovieCredits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department?: string;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id?: string;
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  place_of_birth: string | null;
}

interface MovieImages {
  backdrops: BackdropImage[];
}

export interface BackdropImage {
  file_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  tagline: string;
  origin_country: string[];
  genres: Genre[];
  runtime: number | null;
  images?: MovieImages;
  similar?: SimilarMoviesResponse;
  reviews?: ReviewsResponse;
  videos?: VideosResponse;
  "watch/providers"?: WatchProviders;
  credits?: MovieCredits;
  budget?: number;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountries[];
  spoken_languages?: SpokenLanguages[];
  release_dates?: ResultsReleases;
}