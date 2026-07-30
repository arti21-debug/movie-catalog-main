import { Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import MoviePage from "./components/MoviePage";
import "./main.css";
import { useState } from "react";
import PersonPage from "./components/PersonPage";

export default function App() {
  const [query, setQuery] = useState("");

  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage query={query} setQuery={setQuery} />}
      />
      <Route path="/movie/:id" element={<MoviePage setQuery={setQuery} />} />
      <Route path="/person/:id" element={<PersonPage setQuery={setQuery} />} />
    </Routes>
  );
}