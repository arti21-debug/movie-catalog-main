import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage.js";
import MoviePage from "./components/MoviePage/MoviePage.js";
import "./main.css";
import PersonPage from "./components/PersonPage/PersonPage.js";
import SearchPage from "./components/SearchPage/SearchPage.js";
import WatchlistPage from "./components/WatchlistPage/WatchlistPage.js";
import NotFoundPage from "./components/NotFoundPage.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/person/:id" element={<PersonPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}