export default function Genres({ movie }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="font-sans font-bold">GENRES:</div>
        <div className="flex flex-wrap gap-2">
          {movie?.genres?.map((genre) => (
            <div key={genre.name} className="grey-button">
              {genre.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
