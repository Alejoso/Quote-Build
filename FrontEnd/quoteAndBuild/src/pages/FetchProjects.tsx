// src/pages/FetchProjects.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchAllProjects } from "../api/calls";
import type { Project } from "../types/interfaces";
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    // Send user to SaveProject.tsx (route: /saveProject) with the chosen project id
    navigate("/saveProject", { state: { projectId: p.id } });
  };

  const goToProjectGraphs = (p: ProjectRow) => {
    // Send user to SpecificGraph.tsx (route: /specificGraph/:id) with the chosen project id
    navigate("/specificGraph/",{state: {projectId: p.id} });
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Proyectos</h1>
        <button
          onClick={() => navigate("/saveProject")}
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((p) => (
            <div key={p.id} className="group rounded-2xl border border-gray-200 bg-white p-4 text-left shadow transition hover:-translate-y-0.5 hover:shadow-md flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => goToProject(p)}
                  className="w-full text-left mt-2 rounded-xl bg-white px-4 py-2 font-semibold text-gray-900 transition"
                  aria-label="Ver proyecto"
                >
                  <h2 className="text-lg font-semibold group-hover:text-indigo-600">
                    {p.name}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{p.location}</p>
                  <p className="mt-2 text-sm text-gray-500">
                    Total: $ {" "}
                    {p.total !== null && p.total !== undefined && p.total !== 0
                      ? p.total
                      : "—"}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Duracion total planeada: {p.projectDurationPlanning != null ? p.projectDurationPlanning : <span className="italic text-gray-400">—</span>} dias
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Duracion total ejecutada: {p.projectDurationExecuted != null ? p.projectDurationExecuted : <span className="italic text-gray-400">—</span>} dias
                  </p>
                </button>
                <div className="flex gap-2 items-center h-full">
                  <button
                    onClick={() => goToProject(p)}
                    className="rounded-full p-2 hover:bg-gray-100 ml-4 text-verde"
                    aria-label="Editar proyecto"
                  >
                    <i className="bi bi-pencil text-xl"></i>
                  </button>
                  <button
                    onClick={() => goToProjectGraphs(p)}
                    className="rounded-full p-2 hover:bg-gray-100 text-naranja"
                    aria-label="Ver gráficos"
                  >
                    <i className="bi bi-file-earmark-bar-graph text-xl"></i>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchProjects;
