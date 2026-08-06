import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage/MainPage.jsx";
import MoviePage from "./components/MoviePage/MoviePage.jsx";
import "./main.css";
import PersonPage from "./components/PersonPage/PersonPage.jsx";
import SearchPage from "./components/SearchPage/SearchPage.jsx";
import WatchlistPage from "./components/WatchlistPage/WatchlistPage.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";

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