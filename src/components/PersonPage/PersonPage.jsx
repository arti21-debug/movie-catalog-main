import { useNavigate } from "react-router-dom";
import { usePerson } from "../../hooks/usePerson";
import Header from "../SiteHeader";
import PersonData from "./PersonData";

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

export default function PersonPage() {
  const {
    person,
    error: personError,
    loading: personLoading,
    department,
    uniqueDepartment,
    movies,
    setCurrDepartment,
    title,
  } = usePerson({ departmentTitles });

  const navigate = useNavigate();

  return (
    <div className="text-[#99AABB]">
      <Header info={"main"} />
      <div className="container">
        <div className="mt-8 mb-8 flex justify-between gap-10 max-[550px]:justify-center">
          <div>
            <div className="flex-col items-center max-[550px]:flex">
              <div className="text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)] tracking-wider">
                {title}
              </div>
              <h2 className="mt-1 text-[clamp(1.125rem,1.0179rem+0.4762vw,1.375rem)] font-bold tracking-wider text-white">
                {person?.name}
              </h2>
            </div>
            <div className="mt-2 hidden justify-center max-[550px]:flex">
              <PersonData person={person} />
            </div>
            <div className="mt-6">
              <div className="w-full border-b"></div>
              <select
                onChange={(e) => setCurrDepartment(e.target.value)}
                className="mt-3 w-[clamp(6.25rem,6.023rem+1.14vw,6.875rem)] cursor-pointer rounded-sm border border-white/10 bg-[#283038] px-3 py-1.5 text-sm text-[#99aabb] transition-colors duration-200 outline-none hover:border-white/30"
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
              <div className="mt-3 w-full border-b"></div>
            </div>
            <ul className="mt-4 grid grid-cols-4 gap-4 max-[880px]:grid-cols-3 max-[700px]:grid-cols-2">
              {movies.map((movie, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group relative cursor-pointer"
                  >
                    <img
                      className="aspect-2/3 w-34 rounded-sm border border-gray-700 object-cover transition-opacity duration-200 group-hover:opacity-40"
                      src={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                      alt={movie.title}
                      loading="lazy"
                    />

                    {/* Зелёный outline через псевдоэлемент на li */}
                    <div className="pointer-events-none absolute inset-0 rounded-sm border-2 border-transparent transition-colors duration-200 group-hover:border-green-500" />

                    {/* Тултип снизу — не уйдёт за экран */}
                    <div className="absolute right-0 bottom-0 left-0 rounded-b-sm bg-linear-to-t from-black/90 to-transparent px-1.5 py-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <p className="truncate text-[11px] leading-tight font-medium text-white">
                        {movie.title}
                      </p>
                      <div className="mt-0.5 flex items-center justify-between">
                        <span className="text-[10px] text-gray-400">
                          {movie.release_date?.slice(0, 4)}
                        </span>
                        <span className="text-[10px] font-medium text-green-400">
                          ★ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="max-[550px]:hidden">
            <PersonData person={person} />
          </div>
        </div>
      </div>
    </div>
  );
}