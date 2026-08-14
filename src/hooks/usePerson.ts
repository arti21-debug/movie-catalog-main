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

export type DepartmentKey = keyof typeof departmentTitles;

export function usePerson() {
  const [person, setPerson] = useState<PersonWithCredits | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const department = searchParams.get("department");

  const [currDepartment, setCurrDepartment] =
    useState<DepartmentKey>((department as DepartmentKey) ?? "Acting");

  const title = departmentTitles[currDepartment] ?? `FILMS BY`;
  const movies =
    currDepartment === "Acting"
      ? (person?.movie_credits.cast ?? [])
      : (person?.movie_credits.crew?.filter(
          (m) => m.department === currDepartment,
        ) ?? []);

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

  useEffect(() => {
    if (!id) return;

    const headers = {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      accept: "application/json",
    };

    async function getPerson() {
      setLoading(true);

      try {
        const request = fetch(
          `https://api.themoviedb.org/3/person/${id}?append_to_response=movie_credits`,
          {
            headers,
          },
        ).then((res) => {
          if (!res.ok) throw new Error("Ошибка запроса");
          return res.json();
        });

        const resp = await request;
        setPerson(resp);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getPerson();
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