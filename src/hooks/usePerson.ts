import { errorMessage, isAbortError, tmdbFetch } from "@/lib/tmdb";
import { PersonWithCredits } from "@/types/tmdb";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export const departmentTitles = {
  Acting: "FILMS STARRING",
  Directing: "FILMS DIRECTED BY",
  Writing: "FILMS WRITTEN BY",
  Production: "FILMS PRODUCED BY",
  Camera: "FILMS SHOT BY",
  Editing: "FILMS EDITED BY",
  Sound: "FILMS WITH SOUND BY",
  Art: "FILMS DESIGNED BY",
  "Costume & Make-Up": "FILMS WITH COSTUME DESIGN BY",
  "Visual Effects": "FILMS WITH VISUAL EFFECTS BY",
  Lighting: "FILMS WITH LIGHTING BY",
  Crew: "FILMS WITH CREW BY",
} as const;

// ключ отдела: одно из названий, для которых есть заголовок в departmentTitles
export type DepartmentKey = keyof typeof departmentTitles;

export function usePerson() {
  const [person, setPerson] = useState<PersonWithCredits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // id персоны из адреса /person/:id
  const { id } = useParams();
  // отдел из адреса (?department=Directing); его передают кнопки из блоков Cast и Crew
  const [searchParams] = useSearchParams();
  const department = searchParams.get("department");

  // текущий отдел (вкладка фильмографии); стартовое значение берём из URL,
  // а если параметра нет — показываем актёрские работы
  const [currDepartment, setCurrDepartment] = useState<DepartmentKey>(
    (department as DepartmentKey) ?? "Acting",
  );

  const title = departmentTitles[currDepartment] ?? `FILMS BY`;
  // фильмы выбранного отдела: у актёров они лежат в cast, у остальных — в crew
  // и фильтруются по названию отдела
  const movies =
    currDepartment === "Acting"
      ? (person?.movie_credits.cast ?? [])
      : (person?.movie_credits.crew?.filter(
          (m) => m.department === currDepartment,
        ) ?? []);

  // уникальные отделы, в которых человек работал (для переключателя вкладок);
  // Set убирает повторы, filter(Boolean) отбрасывает пустые значения
  const uniqueDepartment = [
    ...new Set(
      person?.movie_credits.crew
        ?.map((role) => role.department)
        .filter(Boolean) ?? [],
    ),
  ];

  useEffect(() => {
    if (person?.name) {
      document.title = `${person.name} — Filmbox`;
    }
  }, [person?.name]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // загрузка данных персоны при смене id
  useEffect(() => {
    if (!id) return;

    // Свой контроллер на каждый запуск: позволяет отменить устаревший запрос.
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);

    // Персона и её фильмография одним запросом: append_to_response
    // подмешивает movie_credits в основной ответ.
    tmdbFetch<PersonWithCredits>(
      `/person/${id}`,
      { append_to_response: "movie_credits" },
      ctrl.signal,
    )
      .then(setPerson) // упрощённая запись, результат сразц попадает в состояние
      .catch((err) => {
        // Отмена запроса — штатная ситуация, пользователю её не показываем.
        if (!isAbortError(err)) setError(errorMessage(err));
      })
      .finally(() => {
        // После отмены состоянием loading уже управляет новый запуск эффекта;
        // сброс здесь вызвал бы мигание индикатора.
        if (!ctrl.signal.aborted) setLoading(false);
      });

    // Cleanup: при смене id или размонтировании отменяем устаревший запрос,
    // чтобы его ответ не перезаписал актуальные данные.
    return () => ctrl.abort();
  }, [id]);

  return {
    person,
    error,
    loading,
    department,
    uniqueDepartment,
    movies,
    setCurrDepartment,
    title,
  };
}
