import { useState } from "react";

export default function PersonData({ person }) {
  const [isBioHidden, setIsBioHidden] = useState(true);

  const words = person?.biography.split(" ");
  const isHide = words?.length > 40;
  const cutedText = person?.biography.split(" ").slice(0, 40).join(" ");

  return (
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
              onClick={() => setIsBioHidden(false)}
              className="mt-1 ml-1 px-2 py-0 bg-[#283038] rounded-sm text-sm border-white/10 hover:text-gray-200 hover:bg-gray-700"
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
  );
}