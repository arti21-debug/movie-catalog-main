import { useEffect, useState } from "react";
import { getCarouselSlides } from "../../../utilits/getCarouselSlides";
import { useSwipe } from "../../hooks/useSwipe";

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

  const { slides } = getCarouselSlides({ movie });

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
            <div key={index} className="grid w-full shrink-0 grid-cols-2 gap-2">
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
                      src={`https://image.tmdb.org/t/p/w1280${img.file_path}`}
                      alt=""
                      className="h-full w-full rounded-xl object-cover"
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
          className="absolute top-1/2 left-2 -translate-y-1/2"
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
          className="absolute top-1/2 right-2 -translate-y-1/2"
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
      <div className="mt-3 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrImgIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${currImgIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}`}
          />
        ))}
      </div>
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
            <img
              onLoad={() => setLoading(false)}
              src={`https://image.tmdb.org/t/p/w1280${currImg}`}
              alt=""
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
        </div>
      )}
    </>
  );
}