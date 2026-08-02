import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import MoviePage from "./components/MoviePage";
import "./main.css";
import PersonPage from "./components/PersonPage";
import SearchPage from "./components/SearchPage";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage />}
      />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/person/:id" element={<PersonPage />} />
      <Route path="/search" element={<SearchPage />} />
    </Routes>
  );
}