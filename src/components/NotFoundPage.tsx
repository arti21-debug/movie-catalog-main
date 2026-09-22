// components/NotFoundPage.jsx
import { Link } from "react-router-dom";
import Header from "./ui/SiteHeader";

export default function NotFoundPage() {
  return (
    <>
      <Header info="main" />
      <main className="flex flex-col items-center justify-center py-32 text-[#99aabb]">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-lg">This page doesn't exist</p>
        <Link
          to="/"
          className="mt-8 rounded-sm bg-[#283038] px-6 py-2 transition hover:bg-gray-700 hover:text-white"
        >
          Back to films
        </Link>
      </main>
    </>
  );
}