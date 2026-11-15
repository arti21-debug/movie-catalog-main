import { Movie } from "@/types/tmdb";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface CastProps {
  movie: Movie | null;
}

// список актёров фильма: первые ~20 кнопок с именами и кнопка «Show all...» для остальных
export default function Cast({ movie }: CastProps) {
  // false — показываем только начало списка, true — весь актёрский состав
  const [allCastShow, setAllCastShow] = useState(false);

  const navigate = useNavigate();

  // первая часть списка: индексы 0–20 (то есть 21 актёр)
  const castFirstPart = movie?.credits?.cast.filter((_, i) => i <= 20);
  // что рисуем сейчас: весь состав или только первая часть;
  // ?? [] защищает от undefined, пока данные фильма не загружены
  const cast = allCastShow
    ? (movie?.credits?.cast ?? [])
    : (castFirstPart ?? []);

  return (
    <div className="mt-4 flex flex-wrap gap-x-1 gap-y-2">
      {cast.map((actor) => (
        // group нужен, чтобы подсказка с ролью появлялась при наведении на всю обёртку
        <div key={actor.id} className="group relative">
          <button
            onClick={() =>
              navigate(
                `/person/${actor.id}?department=${encodeURIComponent(actor.known_for_department ?? "")}`,
              )
            }
            className="grey-button"
          >
            {actor.name}
          </button>
          <div className="absolute bottom-full left-1/2 hidden -translate-x-1/2 -translate-y-1 rounded-sm border border-white/10 bg-[#1a2230] px-3 py-1 text-xs whitespace-nowrap text-white group-hover:block">
            {actor.character}
          </div>
        </div>
      ))}
      {/* кнопка раскрытия полного списка: показывается, пока список свёрнут
          и в нём уже набралось не меньше 20 актёров */}
      {!allCastShow && cast.length >= 20 && (
        <button onClick={() => setAllCastShow(true)} className="grey-button">
          Show all...
        </button>
      )}
    </div>
  );
}
