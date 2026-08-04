import { useNavigate } from "react-router-dom";

export default function Crew({ movie }) {
  const navigate = useNavigate();

  const uniqueDepartments = [
    ...new Set(
      movie?.credits?.crew?.map((p) => p.department).filter(Boolean) ?? [],
    ),
  ];

  return (
    <>
      {uniqueDepartments.map((department, i) => (
        <div
          key={department}
          className={`flex flex-wrap items-center gap-3 ${i === 0 ? "mt-4" : "mt-8"}`}
        >
          <div className="font-sans font-bold">{department.toUpperCase()}:</div>
          <div className="flex flex-wrap gap-x-1 gap-y-2">
            {movie.credits.crew
              .filter((p) => p.department === department)
              .map((p) => (
                <button
                  onClick={() =>
                    navigate(`/person/${p.id}?department=${p.department}`)
                  }
                  key={p.credit_id || p.id}
                  className="grey-button"
                >
                  {p.name}
                </button>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}
