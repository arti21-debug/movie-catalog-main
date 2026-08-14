import { useFiltersStore } from "@/store/useFiltersStore";
import { useEffect, useRef, useState } from "react";

export type SortType =
  "GENRE" | "COUNTRY" | "RUNTIME" | "Find by year" | "Find by rating";

export function useDropdown(sortType: SortType) {
  const [isOpen, setIsOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const genres = useFiltersStore((state) => state.genres);
  const countries = useFiltersStore((state) => state.countries);
  const genresLoading = useFiltersStore((state) => state.genresLoading);
  const countriesLoading = useFiltersStore((state) => state.countriesLoading);
  const genresError = useFiltersStore((state) => state.genresError);
  const countriesError = useFiltersStore((state) => state.countriesError);
  const fetchGenres = useFiltersStore((state) => state.fetchGenres);
  const fetchCountries = useFiltersStore((state) => state.fetchCountries);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setCountryQuery("");

    if (sortType === "GENRE") fetchGenres();
    if (sortType === "COUNTRY") fetchCountries();
  };

  const loading = sortType === "GENRE" ? genresLoading : countriesLoading;
  const error = sortType === "GENRE" ? genresError : countriesError;

  return {
    isOpen,
    genres,
    countries,
    loading,
    error,
    dropdownRef,
    countryQuery,
    setCountryQuery,
    handleOpen,
  };
}