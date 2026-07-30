import { useEffect, useState } from "react";
import { useCarousel } from "../hooks/useCarousel";
import { useSwipe } from "../hooks/useSwipe";

export default function Carousel({ movie }) {
  const [currImgIndex, setCurrImgIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [currImg, setCurrImg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { slides } = useCarousel({ movie });

  const { handleTouchStart, handleTouchEnd } = useSwipe({
    onSwipeLeft: () =>
      setCurrImgIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1)),
    onSwipeRight: () =>
      setCurrImgIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1)),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setCurrImgIndex((index) => (index === slides.length - 1 ? 0 : index + 1));
    }, 10000);

    return () => clearTimeout(timerId);
  }, [currImgIndex, slides.length]);

  return (
    <>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative mt-18 w-full max-w-5xl overflow-hidden rounded-xl"
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currImgIndex * 100}%)`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full shrink-0 grid grid-cols-2 gap-2">
              {slide.map((img) => (
                <div key={img.file_path}>
                  <button
                    onClick={() => {
                      setIsOpen(true);
                      setLoading(true);
                      setCurrImg(img.file_path);
                    }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/original${img.file_path}`}
                      alt=""
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrImgIndex((prev) =>
              prev === 0 ? slides.length - 1 : prev - 1,
            )
          }
          className="absolute left-2 top-1/2 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            setCurrImgIndex((prev) =>
              prev === slides.length - 1 ? 0 : prev + 1,
            )
          }
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div className="flex mt-3 justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrImgIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300
          ${currImgIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
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
            <img
              onLoad={() => setLoading(false)}
              src={`https://image.tmdb.org/t/p/original${currImg}`}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}