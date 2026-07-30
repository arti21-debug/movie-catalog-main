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
    <div className="flex flex-wrap gap-x-1 gap-y-2 mt-4">
      {cast.map((actor) => (
        <div key={actor.id} className="relative group">
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
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1 bottom-full hidden group-hover:block px-3 py-1 bg-[#1a2230] border border-white/10 rounded-sm text-white text-xs whitespace-nowrap">
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