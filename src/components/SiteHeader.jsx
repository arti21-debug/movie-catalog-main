import { useState } from "react";
import search from "../icons/search.svg";

const NAV_ITEMS = [
  "SIGN IN",
  "CREATE ACCOUNT",
  "FILMS",
  "LISTS",
  "MEMBERS",
  "JOURNAL",
];

export default function Header({ setQuery, info }) {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <header
      className={`${info === "main" ? "bg-[#12161a] text-[#99aabb]" : "bg-transparent text-gray-300"} group transition-colors duration-400 h-18 relative z-10`}
    >
      {info === "movie" && <div className="absolute inset-0 bg-linear-to-b from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />}
      <div className="container relative z-10">
        <section className="flex items-center h-18">
          <div className="inline-block">
            <a
              href="/"
              className="logo block h-13.75 bg-no-repeat bg-contain"
            ></a>
          </div>
          <nav className="w-full">
            <ul className="flex items-center justify-between max-[880px]:justify-end">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item}
                  className={`${item === "FILMS" && info === "main" ? "text-white" : ""} max-[880px]:hidden`}
                >
                  <div href="/" className="font-bold text-[#99aabb] hover:text-gray-300 transition duration-300 cursor-pointer">
                    {item}
                  </div>
                </li>
              ))}
              <li>
                <form className="relative" onSubmit={(e) => e.preventDefault()}>
                  <input
                    onChange={(e) => setQuery(e.target.value)}
                    className={`${info === "movie" && "group-hover:bg-gray-500 transition duration-400"} w-[clamp(5.625rem,_4.261rem_+_6.82vw,_9.375rem)] h-7.5 bg-[#2c3440] rounded-[15px] outline-none pl-3 text-[#7b7b7b] focus:bg-[#7b7b7b] focus:text-black`}
                    type="text"
                  />
                  <button
                    className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-4"
                    type="submit"
                    aria-label="search"
                  >
                    <img src={search} alt="" />
                  </button>
                </form>
              </li>
              <li className="hidden relative max-[880px]:block">
                <button
                  className="flex flex-col gap-1.5 p-2"
                  onClick={() => setIsBurgerOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <span className="block w-5 h-0.5 bg-[#99aabb]" />
                  <span className="block w-5 h-0.5 bg-[#99aabb]" />
                  <span className="block w-5 h-0.5 bg-[#99aabb]" />
                </button>

                {isBurgerOpen && (
                  <ul className="absolute right-0 top-full w-40 bg-[#1e2630] border border-white/10 rounded-md z-50">
                    {NAV_ITEMS.map((item) => (
                      <li key={item}>
                        <a
                          href="/"
                          className="block px-4 py-2 text-[#99aabb] text-sm font-bold hover:text-white"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </header>
  );
}