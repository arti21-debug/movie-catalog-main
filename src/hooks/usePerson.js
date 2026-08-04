import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

export function usePerson({ departmentTitles }) {
  const [person, setPerson] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const department = searchParams.get("department");

  const [currDepartment, setCurrDepartment] = useState(department);

  const title = departmentTitles[currDepartment] ?? `FILMS BY`;
  const movies =
    currDepartment === "Acting"
      ? (person?.movie_credits?.cast ?? [])
      : (person?.movie_credits?.crew?.filter(
          (m) => m.department === currDepartment,
        ) ?? []);

  const uniqueDepartment = [
    ...new Set(
      person?.movie_credits?.crew
        ?.map((role) => role.department)
        .filter(Boolean) ?? [],
    ),
  ];

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
        setError(err.message);
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
