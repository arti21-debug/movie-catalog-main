import { useWatchlistStore } from "@/store/useWatchlistStore";
import Header from "../SiteHeader";
import WatchlistMovie from "./WatchlistMovie";
import { useState } from "react";

export default function WatchlistPage() {
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const [currOption, setCurrOption] = useState("all");

  const filtered =
    currOption === "all"
      ? watchlist
      : watchlist.filter((m) => m.status === currOption);

  return (
    <>
      <Header info={"main"} />
      <div className="container">
        <div className="py-8 text-[#99aabb]">
          <div>
            <div className="flex items-end justify-between">
              <h2 className="text-base font-semibold tracking-wide">
                WATCHLIST
              </h2>
              <select
                onChange={(e) => setCurrOption(e.target.value)}
                className="w-[clamp(6.25rem,6.023rem+1.14vw,6.875rem)] cursor-pointer rounded-sm border border-white/10 bg-[#283038] px-3 py-1.5 text-sm text-[#99aabb] transition-colors duration-200 outline-none hover:border-white/30"
              >
                <option value="all">All</option>
                <option value="watched">Watched</option>
                <option value="want">Liked</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
            <div className="border-b pt-2 text-[#7b7f83]"></div>
          </div>
          <div className="mt-4">
            {watchlist.length > 0 && (
              <ul className="flex flex-col gap-4">
                {filtered.map((movie) => {
                  const words = movie?.overview?.split(" ");
                  const isHide = words?.length > 50;
                  const cutedText = movie?.overview
                    ?.split(" ")
                    .slice(0, 50)
                    .join(" ");

                  return (
                    <li key={movie.id}>
                      <WatchlistMovie
                        movie={movie}
                        isHide={isHide}
                        cutedText={cutedText}
                        watchlist={watchlist}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}