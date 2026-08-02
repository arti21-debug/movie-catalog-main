import { useState } from "react";

export function Review({ user }) {
  const [isStatusHidden, setIsStatusHidden] = useState(true);

  const words = user.content.split(" ");
  const isHide = words.length > 50
  const cutedText = user.content.split(" ").slice(0, 50).join(" ");

  return (
    <div className="flex gap-6">
      <div>
        {user.author_details.avatar_path ? (
          <div className="w-12 h-12">
            <img
              src={`https://image.tmdb.org/t/p/original${user.author_details.avatar_path}`}
              alt=""
              className="w-12 h-12 rounded-full object-cover border"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-zinc-700 border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6">
        <div>
          Review by{" "}
          <span className="text-[#AABBCC] font-extrabold">{user.author}</span>
        </div>
        <div className="font-text text-[clamp(0.875rem,0.8214rem+0.2381vw,1rem)] text-[#AABBCC]">
          {isHide ? (
            <div>
              {isStatusHidden ? cutedText : <p>{user.content}</p>}{" "}
              <button
                onClick={() => setIsStatusHidden(prev => prev ? false : true)}
                className="ml-1 px-2 py-0 bg-[#283038] rounded-sm text-sm border-white/10 hover:text-gray-200 hover:bg-gray-700"
                aria-label="show full review"
              >
                •••
              </button>
            </div>
          ) : (
            <p>{user.content}</p>
          )}
        </div>
      <div>{user.updated_at?.slice(0, 10)}</div>
      </div>
    </div>
  );
}