// src/pages/FetchProjects.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchAllProjects } from "../api/calls";
import type { Project } from "../types/interfaces";

// Extend your Project type with id for list rows (DRF returns `id`)
type ProjectRow = Project & { id: number };

const FetchProjects: React.FC = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchAllProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.location].some((f) => (f ?? "").toLowerCase().includes(q))
    );
  }, [projects, query]);

  const goToProject = (p: ProjectRow) => {
    // Send user to SaveProject.tsx (route: /newProject) with the chosen project id
    navigate("/newProject", { state: { projectId: p.id } });
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
        <button
          onClick={() => navigate("/newProject")}
          className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black"
        >
          Nuevo Proyecto
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o ubicación..."
          className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
        />
        <p className="mt-2 text-xs text-gray-500">
          {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow">
          <p className="text-gray-600">No hay proyectos que coincidan con tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => goToProject(p)}
              className="group rounded-2xl border border-gray-200 bg-white p-4 text-left shadow transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                  {p.name}
                </h2>
              </div>
              <p className="mt-1 text-sm text-gray-600">{p.location}</p>
              <p className="mt-2 text-sm text-gray-500">
                Total:{" "}
                {p.total !== null && p.total !== undefined && p.total !== 0
                  ? p.total
                  : "—"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchProjects;
