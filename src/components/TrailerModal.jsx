import { useEffect, useState } from "react";

export default function Trailer({ trailerKey, trailerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="flex justify-center">
      <button
        onClick={() => {
          setLoading(true);
          setIsOpen(true);
        }}
        className="mt-6 w-[clamp(130px,13vw,165px)] px-[clamp(0.75rem,0.6rem+0.5vw,1rem)] py-[clamp(0.35rem,0.28rem+0.2vw,0.45rem)] text-[clamp(0.6rem,0.58rem+0.12vw,0.7rem)] bg-emerald-900 rounded-[clamp(0.3rem,0.25rem+0.15vw,0.4rem)] font-bold tracking-[0.12em] hover:text-gray-200 hover:bg-green-900 transition duration-200"
      >
        SHOW TRAILER
      </button>

      {isOpen && (
        <div
          onClick={() => {
            setLoading(false);
            setIsOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[90%] max-w-5xl aspect-video"
          >
            {loading && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 rounded-full border-3 border-gray-700 border-t-lime-500 animate-spin" />
              </div>
            )}
            {!loading && (
              <button
                onClick={() => {
                  setLoading(false);
                  setIsOpen(false);
                }}
                className="absolute top-1 right-3 text-xl hover:text-red-700 transition duration-200"
              >
                X
              </button>
            )}
            <iframe
              onLoad={() => setLoading(false)}
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={trailerName}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
