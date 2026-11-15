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
    <Routes>
      <Route path="/" element={<MainPage />} key={pathname} />
      <Route path="/movie/:id" element={<MoviePage />} key={pathname} />
      <Route path="/person/:id" element={<PersonPage />} key={pathname} />
      <Route path="/search" element={<SearchPage />} key={pathname} />
      <Route path="/watchlist" element={<WatchlistPage />} key={pathname} />
      <Route path="*" element={<NotFoundPage />} key={pathname} />
    </Routes>
  );
}
