import { Routes, Route, useLocation } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage.js";
import MoviePage from "./components/MoviePage/MoviePage.js";
import "./main.css";
import PersonPage from "./components/PersonPage/PersonPage.js";
import SearchPage from "./components/SearchPage/SearchPage.js";
import WatchlistPage from "./components/WatchlistPage/WatchlistPage.js";
import NotFoundPage from "./components/NotFoundPage.js";

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/movie/:id" element={<MoviePage key={pathname} />} />
        <Route path="/person/:id" element={<PersonPage key={pathname} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <footer className="bg-[#12161a] py-6 text-center text-xs text-[#99aabb]">
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
        <p className="mt-1">
          Streaming availability data provided by JustWatch.
        </p>
      </footer>
    </>
  );
}
