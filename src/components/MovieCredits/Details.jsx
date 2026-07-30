export default function Details({ movie }) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="font-sans font-bold">STUDIOS:</div>
        <div className="flex flex-wrap gap-2">
          {movie?.production_companies?.map((comp) => (
            <div key={comp.name} className="grey-button">
              {comp.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="font-sans font-bold">COUNTRY:</div>
        <div className="flex flex-wrap gap-2">
          {movie?.production_countries?.map((ctry) => (
            <div key={ctry.name} className="grey-button">
              {ctry.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="font-sans font-bold">LANGUAGE:</div>
        <div className="flex flex-wrap gap-2">
          {movie?.spoken_languages?.map((lang) => (
            <div key={lang.english_name} className="grey-button">
              {lang.english_name}
            </div>
          ))}
        </div>
      </div>
      {movie?.budget > 0 && (
        <div className="flex flex-wrap gap-4 items-center">
          <div className="font-sans font-bold">BUDGET:</div>
          <div className="grey-button">
            {movie?.budget.toLocaleString("en-US")}$
          </div>
        </div>
      )}
    </div>
  );
}