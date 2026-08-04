import { useState } from "react";
import search from "../icons/search.svg";
import { Link, useNavigate } from "react-router-dom";
import { Popcorn } from "lucide-react";

const NAV_ITEMS = [
  "SIGN IN",
  "CREATE ACCOUNT",
  "FILMS",
  "LISTS",
  "MEMBERS",
  "JOURNAL",
];

export default function Header({ info }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const navigate = useNavigate();

  return (
    <header
      className={`${info === "main" ? "bg-[#12161a] text-[#99aabb]" : "bg-transparent text-gray-300"} group relative z-10 h-18 transition-colors duration-400`}
    >
      {info === "movie" && (
        <div className="absolute inset-0 bg-linear-to-b from-black/90 to-transparent opacity-0 transition-opacity duration-400 group-hover:opacity-100" />
      )}
      <div className="relative z-10 container">
        <section className="flex h-18 items-center">
          <div className="inline-block">
            <a
              href="/"
              className="logo block h-13.75 bg-contain bg-no-repeat"
            ></a>
          </div>
          <nav className="w-full">
            <ul className="flex items-center justify-between gap-3 max-[1050px]:justify-end">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item}
                  className={`${item === "FILMS" && info === "main" ? "text-white" : ""} max-[1050px]:hidden`}
                >
                  <div
                    href="/"
                    className="cursor-pointer font-bold text-[#99aabb] transition duration-300 hover:text-gray-300"
                  >
                    {item}
                  </div>
                </li>
              ))}
              <li>
                <form
                  className="relative"
                  onSubmit={(e) => {
                    e.preventDefault();
                    navigate(
                      `/search?query=${encodeURIComponent(searchQuery)}`,
                    );
                  }}
                >
                  <input
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${info === "movie" && "transition duration-400 group-hover:bg-gray-500"} h-7.5 w-[clamp(4.375rem,2.557rem+9.09vw,9.375rem)] rounded-[15px] bg-[#2c3440] pl-3 pr-8 text-[#7b7b7b] outline-none focus:bg-[#7b7b7b] focus:text-black`}
                    type="text"
                  />
                  <button
                    className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2"
                    type="submit"
                    aria-label="search"
                  >
                    <img src={search} alt="" />
                  </button>
                </form>
              </li>
              <li className="relative hidden max-[1050px]:block">
                <button
                  className="flex w-[clamp(1.875rem,1.739rem+0.68vw,2.25rem)] flex-col gap-1.5 p-2"
                  onClick={() => setIsBurgerOpen((prev) => !prev)}
                  aria-label="Toggle menu"
                >
                  <span className="block h-0.5 w-5 bg-[#99aabb]" />
                  <span className="block h-0.5 w-5 bg-[#99aabb]" />
                  <span className="block h-0.5 w-5 bg-[#99aabb]" />
                </button>

                {isBurgerOpen && (
                  <ul className="absolute top-full right-0 z-50 w-40 rounded-md border border-white/10 bg-[#1e2630]">
                    {NAV_ITEMS.map((item) => (
                      <li key={item}>
                        <a
                          href="/"
                          className="block px-4 py-2 text-sm font-bold text-[#99aabb] hover:text-white"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li>
                <Link to="/watchlist">
                  <Popcorn
                    color="#ffcd1a"
                    className="transition-transform duration-300 hover:scale-110 hover:-rotate-12"
                  />
                </Link>
              </li>
            </ul>
          </nav>
        </section>
      </div>
    </header>
  );
}