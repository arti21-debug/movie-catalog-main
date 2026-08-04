import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Cast({ movie }) {
  const [allCastShow, setAllCastShow] = useState(false);

  const navigate = useNavigate();

  const castFirstPart = movie?.credits?.cast.filter((actor, i) => i <= 20);
  const cast = allCastShow
    ? (movie?.credits?.cast ?? [])
    : (castFirstPart ?? []);

  return (
    <div className="mt-4 flex flex-wrap gap-x-1 gap-y-2">
      {cast.map((actor) => (
        <div key={actor.id} className="group relative">
          <button
            onClick={() =>
              navigate(
                `/person/${actor.id}?department=${actor.known_for_department}`,
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
      {!allCastShow && cast.length >= 20 && (
        <button onClick={() => setAllCastShow(true)} className="grey-button">
          Show all...
        </button>
      )}
    </div>
  );
}
