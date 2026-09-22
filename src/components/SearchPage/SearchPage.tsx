import { useSearchParams } from "react-router-dom";
import { useSearch } from "@/hooks/useSearch";
import Header from "../ui/SiteHeader";
import SearchedMovie from "./SearchedMovie";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") ?? "";
  const currentPage = Number(searchParams.get("page") ?? 1);

  const {
    searchResult,
    loading: searchLoading,
    error: searchError,
  } = useSearch({query, currentPage});

  return (
    <>
      <Header info={"main"} />
      <main className="text-[#99aabb]">
        <div className="container">
          <div className="py-8">
            {!searchLoading && (
              <div>
                <h2 className="text-base font-semibold tracking-wide">
                  SHOWING MATCHES FOR "{query.toUpperCase()}"
                </h2>
                <div className="border-b pt-2 text-[#7b7f83]"></div>
              </div>
            )}

            <div className="mt-4">
              {searchError && (
                <p className="text-center text-red-400">{searchError}</p>
              )}
              {searchResult.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {searchResult.map((movie) => {
                    const words = movie?.overview?.split(" ");
                    const isHide = words?.length > 50;
                    const cutedText = movie?.overview
                      ?.split(" ")
                      .slice(0, 50)
                      .join(" ");

                    return (
                      <li key={movie.id}>
                        <SearchedMovie
                          movie={movie}
                          isHide={isHide}
                          cutedText={cutedText}
                        />
                      </li>
                    );
                  })}
                </ul>
              ) : (
                !searchLoading &&
                searchResult.length === 0 && (
                  <div className="text-center text-base font-bold text-amber-500">
                    Movies not found...
                  </div>
                )
              )}
            </div>
            {searchLoading && (
              <div className="relative min-h-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-lime-500" />
                </div>
              </div>
            )}
            {!searchLoading && searchResult.length > 0 && (
              <div className="flex justify-center">
                <button
                  onClick={() =>
                    setSearchParams({ query, page: String(currentPage + 1) })
                  }
                  className="mt-8 rounded-sm border-t border-white/10 bg-[#283038] whitespace-nowrap transition duration-200 hover:bg-gray-700 hover:text-gray-200"
                  style={{
                    padding:
                      "clamp(0.125rem, 0.1rem + 0.125vw, 0.25rem) clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem)",
                    fontSize: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)",
                  }}
                >
                  Show more results
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}