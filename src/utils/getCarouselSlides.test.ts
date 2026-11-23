import { describe, expect, it } from "vitest";
import { getCarouselSlides } from "./getCarouselSlides";
import { BackdropImage, Movie } from "@/types/tmdb";

// фильм с нужным числом кадров; остальные поля не важны для этой функции
const movieWith = (count: number) =>
  ({
    images: {
      backdrops: Array.from({ length: count }, (_, i) => ({
        file_path: `/img${i}.jpg`,
      })) as BackdropImage[],
    },
  }) as unknown as Movie;

describe("getCarouselSlides", () => {
  it("группирует кадры по парам", () => {
    const { slides } = getCarouselSlides(movieWith(4));

    expect(slides).toHaveLength(2);
    expect(slides[0].map((s) => s.file_path)).toEqual([
      "/img0.jpg",
      "/img1.jpg",
    ]);
    expect(slides[1].map((s) => s.file_path)).toEqual([
      "/img2.jpg",
      "/img3.jpg",
    ]);
  });

  it("отбрасывает последний кадр без пары", () => {
    const { slides } = getCarouselSlides(movieWith(5));

    expect(slides).toHaveLength(2);
    expect(slides.flat()).toHaveLength(4);
  });

  it("берёт не больше 11 кадров, то есть максимум 5 слайдов", () => {
    const { slides } = getCarouselSlides(movieWith(30));

    // 11 кадров → 5 пар, одиннадцатый без пары отброшен
    expect(slides).toHaveLength(5);
  });

  it("возвращает пустой список, если фильм не загружен или кадров нет", () => {
    expect(getCarouselSlides(null).slides).toEqual([]);
    expect(getCarouselSlides(movieWith(0)).slides).toEqual([]);
    expect(getCarouselSlides(movieWith(1)).slides).toEqual([]); // один кадр пары не образует
  });
});
