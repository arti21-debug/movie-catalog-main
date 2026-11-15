import { Movie } from "@/types/tmdb";
import { useNavigate } from "react-router-dom";

interface CrewProps {
  movie: Movie;
}

// блок съёмочной группы: сгруппирован по отделам (Directing, Writing, Production и т.д.),
// в каждом отделе кнопки с именами людей
export default function Crew({ movie }: CrewProps) {
  const navigate = useNavigate();

  // уникальные названия отделов в порядке первого появления в списке:
  // Set убирает повторы, filter(Boolean) отбрасывает пустые значения,
  // ?? [] защищает от случая, когда данные фильма ещё не загружены
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
            {movie?.credits?.crew
              .filter((p) => p.department === department)
              .map((p) => (
                <button
                  onClick={() =>
                    navigate(`/person/${p.id}?department=${encodeURIComponent(p.department)}`)
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