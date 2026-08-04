import { useEffect, useRef, useState } from "react";

export function useDropdown(sortType) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropList, setDropList] = useState([]);
  const dropdownRef = useRef(null);
  const [countryQuery, setCountryQuery] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setCountryQuery("");

    if (dropList.length > 0) return;

    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    };

    switch (sortType) {
      case "GENRE":
        fetch("https://api.themoviedb.org/3/genre/movie/list", { headers })
          .then((res) => res.json())
          .then((data) => setDropList(data.genres));
        break;
      case "COUNTRY":
        fetch("https://api.themoviedb.org/3/configuration/countries", {
          headers,
        })
          .then((res) => res.json())
          .then((data) => setDropList(data));
        break;
    }
  };

  return {
    isOpen,
    dropList,
    dropdownRef,
    countryQuery,
    setCountryQuery,
    handleOpen,
  };
}
