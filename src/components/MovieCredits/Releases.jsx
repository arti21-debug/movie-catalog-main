export default function Releases({ movie }) {
  return (
    <div className="mt-4">
      <h2 className="font-text font-bold tracking-wider">PREMIERE</h2>
      <div className="mt-1 border-b text-[#283038]"></div>
      <div className="mt-4 flex flex-col gap-4">
        {movie?.release_dates?.results?.map((ctry) => (
          <div key={ctry.iso_3166_1}>
            <div className="flex justify-between">
              <div>{ctry.release_dates[0].release_date.slice(0, 10)}</div>
              <div>{ctry.iso_3166_1}</div>
              <img className="w-6 h-6 object-cover rounded-full" src={`https://flagcdn.com/w40/${ctry.iso_3166_1.toLowerCase()}.png`} alt="" />
            </div>
            <div className="w-full mt-1 border-b text-[#283038]"></div>
          </div>
        ))}
      </div>
    </div>
  );
}