import { useEffect, useState } from "react";

interface TrailerProps {
  trailerKey: string | undefined;
  trailerName: string | undefined;
}

export default function Trailer({ trailerKey, trailerName }: TrailerProps) {
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
        className="mt-6 w-[clamp(130px,13vw,165px)] rounded-[clamp(0.3rem,0.25rem+0.15vw,0.4rem)] bg-emerald-900 px-[clamp(0.75rem,0.6rem+0.5vw,1rem)] py-[clamp(0.35rem,0.28rem+0.2vw,0.45rem)] text-[clamp(0.6rem,0.58rem+0.12vw,0.7rem)] font-bold tracking-[0.12em] transition duration-200 hover:scale-105 hover:bg-green-900 hover:text-gray-200 hover:shadow-[0_0_10px_rgba(22,163,74,0.25)] active:scale-95"
      >
        SHOW TRAILER
      </button>

      {isOpen && (
        <div
          onClick={() => {
            setLoading(false);
            setIsOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-video w-[90%] max-w-5xl"
          >
            {loading && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-gray-700 border-t-lime-500" />
              </div>
            )}
            {!loading && (
              <button
                onClick={() => {
                  setLoading(false);
                  setIsOpen(false);
                }}
                className="absolute top-1 right-3 text-xl transition duration-200 hover:text-red-700"
              >
                X
              </button>
            )}
            <iframe
              onLoad={() => setLoading(false)}
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title={trailerName}
              className="h-full w-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}