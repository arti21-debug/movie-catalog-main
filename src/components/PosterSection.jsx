export default function PosterSection({ movie, filteredProviders }) {
  return (
      <div className="flex flex-col items-center w-[clamp(150px,15vw,230px)]">
        <img
          className="relative z-10 w-full h-auto rounded-md"
          src={`https://image.tmdb.org/t/p/original${movie?.poster_path}`}
          alt={movie?.title}
          loading="lazy"
        />
        <div className="pt-10 w-full">
          <nav className="border border-gray-500 rounded-md overflow-hidden">
            <div className="bg-[#283038] p-3">WHERE TO WATCH</div>
            <ul className="font-sans text-xs p-2">
              {filteredProviders.length > 0 ? (
                filteredProviders.map((source) => (
                  <li key={source.provider_id} className="p-2">
                    <div className="p-2 flex items-center gap-3">
                      <img
                        className="w-8 rounded-lg shrink-0"
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