import { describe, expect, it } from "vitest";
import { countTotalResults } from "./countTotalResults";

const page = (total_results: number) => ({ total_results });

describe("countTotalResults", () => {
  it("без фильтра по годам берёт total_results один раз, а не по числу страниц", () => {
    // три страницы одного запроса, у каждой одно и то же общее число
    expect(countTotalResults([page(1000), page(1000), page(1000)])).toBe(1000);
  });

  it("с несколькими годами суммирует по одному значению на каждый год", () => {
    // год 1: три страницы по 120, год 2: три страницы по 80
    expect(
      countTotalResults([
        page(120),
        page(120),
        page(120),
        page(80),
        page(80),
        page(80),
      ]),
    ).toBe(200);
  });

  it("работает, если у запроса вернулась одна страница", () => {
    expect(countTotalResults([page(15)])).toBe(15);
  });

  it("возвращает 0 для пустого списка", () => {
    expect(countTotalResults([])).toBe(0);
  });
});
