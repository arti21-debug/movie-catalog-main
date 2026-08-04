export default function PosterSection({ movie, filteredProviders }) {
  return (
    <div className="flex w-[clamp(150px,15vw,230px)] flex-col items-center">
      <img
        className="relative z-10 h-auto w-full rounded-md"
        src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
        alt={movie?.title}
        loading="lazy"
      />
      <div className="w-full pt-10">
        <nav className="overflow-hidden rounded-md border border-gray-500">
          <div className="bg-[#283038] p-3">WHERE TO WATCH</div>
          <ul className="p-2 font-sans text-xs">
            {filteredProviders.length > 0 ? (
              filteredProviders.map((source) => (
                <li key={source.provider_id} className="p-2">
                  <div className="flex items-center gap-3 p-2">
                    <img
                      className="w-8 shrink-0 rounded-lg"
                      src={`https://image.tmdb.org/t/p/w92${source.logo_path}`}
                      alt=""
                    />
                    <p>{source.provider_name}</p>
                  </div>
                  <div className="border-b text-[#283038]"></div>
                </li>
              ))
            ) : (
              <li className="flex flex-col gap-2 p-2 text-xs font-bold text-lime-800">
                <div>🎬 Streaming availability coming soon...</div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
