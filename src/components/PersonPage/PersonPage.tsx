import { useNavigate } from "react-router-dom";
import { usePerson, DepartmentKey } from "@/hooks/usePerson";
import Header from "../ui/SiteHeader";
import PersonData from "./PersonData";
import Movie from "../ui/Movie";

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
  } = usePerson();

  const navigate = useNavigate();

  if (personLoading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#14181C]">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-lime-500" />
      </div>
    );

  if (personError)
    return (
      <div className="flex h-screen items-center justify-center bg-[#14181C] text-red-400">
        {personError}
      </div>
    );

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
                onChange={(e) => setCurrDepartment(e.target.value as DepartmentKey)}
                className="mt-3 w-[clamp(6.25rem,6.023rem+1.14vw,6.875rem)] cursor-pointer rounded-sm border border-white/10 bg-[#283038] px-3 py-1.5 text-sm text-[#99aabb] transition-colors duration-200 outline-none hover:border-white/30"
              >
                <option value={department ?? ""}>{department}</option>
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
              {movies.map((movie) => {
                return (
                  <li
                    key={movie.id}
                    onClick={() => navigate(`/movie/${movie.id}`)}
                    className="group relative max-w-35 cursor-pointer"
                  >
                    <Movie movie={movie} />
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