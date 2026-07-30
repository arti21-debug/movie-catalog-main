import { useNavigate } from "react-router-dom";
import { usePerson } from "../hooks/usePerson";
import Header from "./SiteHeader";
import { useState } from "react";

const departmentTitles = {
  Acting: "FILMS STARRING",
  Directing: "FILMS DIRECTED BY",
  Writing: "FILMS WRITTEN BY",
  Production: "FILMS PRODUCED BY",
  Camera: "FILMS SHOT BY",
  Editing: "FILMS EDITED BY",
  Sound: "FILMS WITH SOUND BY",
  Art: "FILMS DESIGNED BY",
  "Costume & Make-Up": "FILMS WITH COSTUME DESIGN BY",
  "Visual Effects": "FILMS WITH VISUAL EFFECTS BY",
  Lighting: "FILMS WITH LIGHTING BY",
  Crew: "FILMS WITH CREW BY",
};

export default function PersonPage({ setQuery }) {
  const [isBioHidden, setIsBioHidden] = useState(true);

  const {
    person,
    error: personError,
    loading: personLoading,
    department,
    uniqueDepartment,
    movies,
    setCurrDepartment,
    title,
    isHide,
    cutedText,
  } = usePerson({ departmentTitles });

  const navigate = useNavigate();
  console.log(person);

  return (
    <div className="text-[#99AABB]">
      <Header setQuery={setQuery} info={"main"} />
      <div className="container">
        <div className="flex justify-between gap-10 mt-8">
          <div>
            <div>
              <div className="tracking-wider text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)]">{title}</div>
              <h2 className="mt-1 text-[clamp(1.125rem,1.0179rem+0.4762vw,1.375rem)] text-white font-bold tracking-wider">
                {person?.name}
              </h2>
            </div>
            <div className="mt-6">
              <div className="w-full border-b"></div>
              <select
                onChange={(e) => setCurrDepartment(e.target.value)}
                className="mt-3 bg-[#283038] text-[#99aabb] text-sm border border-white/10 rounded-sm px-3 py-1.5 outline-none cursor-pointer hover:border-white/30 transition-colors duration-200"
              >
                <option value={department}>{department}</option>
                {uniqueDepartment
                  .filter((dep) => dep !== department)
                  .map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
              </select>
              <div className="w-full mt-3 border-b"></div>
            </div>
            <ul className="grid grid-cols-4 max-[880px]:grid-cols-3 max-[700px]:grid-cols-2 max-[550px]:grid-cols-1 gap-4 mt-4">
              {movies.map((movie, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group relative cursor-pointer"
                  >
                    <img
                      className="w-34 aspect-2/3 object-cover rounded-sm border border-gray-700 
               transition-opacity duration-200 group-hover:opacity-40"
                      src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                    />

                    {/* Зелёный outline через псевдоэлемент на li */}
                    <div
                      className="absolute inset-0 rounded-sm border-2 border-transparent 
                  group-hover:border-green-500 transition-colors duration-200 pointer-events-none"
                    />

                    {/* Тултип снизу — не уйдёт за экран */}
                    <div
                      className="absolute left-0 right-0 bottom-0 
                  bg-gradient-to-t from-black/90 to-transparent
                  px-1.5 py-2 rounded-b-sm
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-200"
                    >
                      <p className="text-white text-[11px] font-medium leading-tight truncate">
                        {movie.title}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-gray-400 text-[10px]">
                          {movie.release_date?.slice(0, 4)}
                        </span>
                        <span className="text-green-400 text-[10px] font-medium">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="max-w-[clamp(11.25rem,10.114rem+5.68vw,14.375rem)]">
            {person?.profile_path && (
              <img
                src={`https://image.tmdb.org/t/p/w342${person?.profile_path}`}
                alt=""
                className="w-full rounded-sm border"
              />
            )}
            <div className="mt-4">
              {isHide && isBioHidden ? (
                <div>
                  {cutedText}{" "}
                  <button
                    onClick={() =>
                      setIsBioHidden(false)
                    }
                    className="ml-1 px-2 py-0 bg-[#283038] rounded-sm text-sm border-white/10 hover:text-gray-200 hover:bg-gray-700"
                    aria-label="show full review"
                  >
                    •••
                  </button>
                </div>
              ) : (
                person?.biography
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}