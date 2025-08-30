// src/pages/SaveProject.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import { createProject, fetchProjectById, updateProject } from "../api/calls";
import SavePhase from "./SavePhase";

type ProjectForm = {
  name: string;
  location: string;
  total: string; // usar string para el input, convertimos al enviar
};

export default function SaveProject() {
  const navigate = useNavigate();

  // 1) tomar projectId desde location.state o desde ?id= en la URL
  const location = useLocation() as { state?: { projectId?: number } };
  const stateId = location?.state?.projectId;
  const queryId = useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    const raw = sp.get("id");
    return raw ? Number(raw) : undefined;
  }, []);
  const initialProjectId = typeof stateId === "number" ? stateId : typeof queryId === "number" ? queryId : undefined;

  const [projectId, setProjectId] = useState<number | undefined>(initialProjectId);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    location: "",
    total: "",
  });

  // Cargar proyecto existente si hay projectId
  useEffect(() => {
    const run = async () => {
      if (!projectId) return;
      try {
        setLoading(true);
        const { data } = await fetchProjectById(projectId);
        // DRF puede devolver total como string; aseguramos string en el form
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          total: data.total !== null && data.total !== undefined ? String(data.total) : "",
        });
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el proyecto.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const buildPayload = () => {
    const payload: any = {
      name: form.name.trim(),
      location: form.location.trim(),
    };
    if (form.total.trim() === "") {
      payload.total = null;
    } else {
      const n = Number(form.total);
      if (Number.isNaN(n)) {
        throw new Error("El total debe ser un número válido.");
      }
      payload.total = Number(n.toFixed(2));
    }
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.location.trim()) {
      toast.error("Nombre y ubicación son obligatorios.");
      return;
    }
    try {
      setSaving(true);
      const payload = buildPayload();

      if (projectId) {
        const { data } = await updateProject(projectId, payload);
        toast.success(`Proyecto actualizado (${data.name}).`);
      } else {
        const { data } = await createProject(payload);
        toast.success(`Proyecto creado (${data.name}).`);
        setProjectId(data.id); // ahora tenemos id, mostramos fases debajo
      }
    } catch (err: any) {
      toast.error(err?.message || "No se pudo guardar el proyecto.");
    } finally {
      setSaving(false);
    }
  };

  const title = projectId ? "Editar Proyecto" : "Nuevo Proyecto";

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <Toaster />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <button
          onClick={() => navigate("/projects")}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver a Proyectos
        </button>
      </div>

      {/* Formulario del proyecto */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={100}
            required
            disabled={loading}
            placeholder="Ej: Skyline Tower"
            value={form.name}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="location" className="mb-1 block text-sm font-medium text-gray-700">
            Ubicación *
          </label>
          <input
            id="location"
            name="location"
            type="text"
            maxLength={160}
            required
            disabled={loading}
            placeholder="Ej: Bogotá, Cundinamarca"
            value={form.location}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
        </div>

        <div>
          <label htmlFor="total" className="mb-1 block text-sm font-medium text-gray-700">
            Total (opcional)
          </label>
          <input
            id="total"
            name="total"
            type="number"
            step="0.01"
            min="0"
            disabled={loading}
            placeholder="0.00"
            value={form.total}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          />
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando..." : projectId ? "Guardar cambios" : "Crear proyecto"}
        </button>
      </form>

      {/* Fases del proyecto */}
      <div className="mt-8">
        <SavePhase project={projectId} />
      </div>
    </div>
  );
}
