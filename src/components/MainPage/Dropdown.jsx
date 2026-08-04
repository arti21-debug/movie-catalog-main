import chevronDown from "@/icons/chevron-down.svg";
import chevronTop from "@/icons/chevron-top.svg";
import { useDropdown } from "@/hooks/useDropdown";

const ratingOptions = [
  { label: "Any", min: null, max: null },
  { label: "9+ ⭐", min: 9, max: null },
  { label: "8+ ⭐", min: 8, max: null },
  { label: "7+ ⭐", min: 7, max: null },
  { label: "6+ ⭐", min: 6, max: null },
  { label: "5+ ⭐", min: 5, max: null },
];

const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, i) => currentYear - i,
);

const runtimeOptions = [
  { label: "Any", min: null, max: null },
  { label: "Under 90 min", min: null, max: 89 },
  { label: "90–120 min", min: 90, max: 120 },
  { label: "120–150 min", min: 120, max: 150 },
  { label: "Over 150 min", min: 150, max: null },
];

const countriesDroplist = [
  { iso: "US", country: "USA" },
  { iso: "GB", country: "United Kingdom" },
  { iso: "FR", country: "France" },
  { iso: "DE", country: "Germany" },
  { iso: "JP", country: "Japan" },
  { iso: "KR", country: "South Korea" },
  { iso: "CA", country: "Canada" },
  { iso: "IT", country: "Italy" },
];

export default function Dropdown({
  sortType,
  selectedGenres,
  onGenreChange,
  selectedCountries,
  onCountryChange,
  selectedRuntime,
  onRuntimeChange,
  selectedYears,
  onYearChange,
  selectedRating,
  onRatingChange,
}) {
  const {
    isOpen,
    dropList,
    dropdownRef,
    countryQuery,
    setCountryQuery,
    handleOpen,
  } = useDropdown(sortType);

  const handleYearClick = (year) => {
    const newYears = selectedYears.includes(year)
      ? selectedYears.filter((y) => y !== year)
      : [...selectedYears, year];

    onYearChange(newYears);
  };

  const handleCountryClick = (countryName) => {
    const newCountries = selectedCountries.includes(countryName)
      ? selectedCountries.filter((c) => c !== countryName)
      : [...selectedCountries, countryName];

    onCountryChange(newCountries);
  };

  const handleGenreClick = (genreId) => {
    const newGenres = selectedGenres.includes(genreId)
      ? selectedGenres.filter((g) => g !== genreId)
      : [...selectedGenres, genreId];

    onGenreChange(newGenres);
  };

  return (
    <header className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className={"flex items-center gap-2"}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{sortType}</span>
        <span>
          {isOpen ? (
            <img src={chevronTop} alt="chevron-top" />
          ) : (
            <img src={chevronDown} alt="chevron-down" />
          )}
        </span>
      </button>

      {isOpen && sortType === "GENRE" && (
        <ul
          className="absolute top-full z-10 max-h-62.5 cursor-pointer overflow-y-auto rounded-[5px] bg-gray-700 p-1"
          role="listbox"
        >
          {dropList.map((genre) => {
            return (
              <li
                key={genre.id}
                className="px-4 py-0.5 text-nowrap hover:bg-gray-800 hover:text-emerald-600"
                onClick={() => handleGenreClick(genre.id)}
                role="option"
                aria-selected={selectedGenres.includes(genre.id)}
              >
                {selectedGenres.includes(genre.id) && (
                  <span className="text-emerald-500">✔ </span>
                )}
                {genre.name}
              </li>
            );
          })}
        </ul>
      )}

      {isOpen && sortType === "COUNTRY" && (
        <ul className="absolute top-full z-10 max-h-62.5 cursor-pointer overflow-y-auto rounded-[5px] bg-gray-700 p-1">
          <li className="px-4 py-0.5 text-xs text-black">
            {
              <input
                onChange={(e) => setCountryQuery(e.target.value)}
                type="text"
                className="rounded-sm bg-gray-400 px-1 py-0.5 text-black"
                placeholder="search country..."
              />
            }
          </li>
          <li className="cursor-auto px-4 py-0.5 pb-2 font-semibold text-amber-500">
            {selectedCountries.length > 0 && "Selected Countries:"}
            {selectedCountries.map((ctry) => (
              <div key={ctry}>{ctry}</div>
            ))}
          </li>
          <li className="cursor-auto px-4 py-0.5 pb-2 font-semibold text-emerald-600">
            {countryQuery === "" ? "Popular:" : "Search results:"}
          </li>
          {(countryQuery === ""
            ? countriesDroplist.map((ctry) => ({
                id: ctry.iso,
                name: ctry.country,
                iso: ctry.iso,
              }))
            : dropList
                .filter((ctry) =>
                  ctry.english_name
                    .toLowerCase()
                    .includes(countryQuery.toLowerCase()),
                )
                .map((ctry) => ({
                  id: ctry.english_name,
                  name: ctry.english_name,
                  iso: ctry.iso_3166_1,
                }))
          ).map((ctry) => (
            <li
              key={ctry.id}
              onClick={() => handleCountryClick(ctry.iso)}
              className="px-4 py-0.5 hover:bg-gray-800 hover:text-emerald-600"
              role="option"
            >
              {selectedCountries.includes(ctry.iso) && (
                <span className="text-emerald-500">✔ </span>
              )}
              {ctry.name}
            </li>
          ))}
        </ul>
      )}

      {isOpen && sortType === "RUNTIME" && (
        <ul className="absolute top-full z-10 max-h-62.5 cursor-pointer overflow-y-auto rounded-[5px] bg-gray-700 p-1">
          {runtimeOptions.map((time) => (
            <li
              key={time.label}
              onClick={() => onRuntimeChange(time)}
              className={`px-4 py-0.5 text-nowrap hover:bg-gray-800 hover:text-emerald-600 ${selectedRuntime.label === time.label && "font-semibold text-emerald-500"}`}
            >
              {time.label}
            </li>
          ))}
        </ul>
      )}

      {isOpen && sortType === "Find by year" && (
        <ul className="absolute top-full z-10 max-h-62.5 cursor-pointer overflow-y-auto rounded-[5px] bg-gray-700 p-1">
          {years.map((year) => (
            <li
              key={year}
              onClick={() => handleYearClick(year)}
              className={`px-4 py-0.5 text-nowrap hover:bg-gray-800 hover:text-emerald-600 ${selectedYears.includes(year) && "font-semibold text-emerald-500"}`}
            >
              {year}
            </li>
          ))}
        </ul>
      )}

      {isOpen && sortType === "Find by rating" && (
        <ul className="absolute top-full z-10 max-h-62.5 cursor-pointer overflow-y-auto rounded-[5px] bg-gray-700 p-1">
          {ratingOptions.map((rat) => (
            <li
              key={rat.label}
              onClick={() => onRatingChange(rat)}
              className={`px-4 py-0.5 text-nowrap hover:bg-gray-800 hover:text-emerald-600 ${selectedRating.label === rat.label && "font-semibold text-emerald-500"}`}
            >
              {rat.label}
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
