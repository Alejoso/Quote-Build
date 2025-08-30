// src/components/NewPh.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { createPhase, fetchPhasesByProject, updatePhase } from "../api/calls";
import type { Phase } from "../types/interfaces";

type Props = {
  projectId: number | null; // parent passes this after project is created
};

const NewPh: React.FC<Props> = ({ projectId }) => {
  const [loading, setLoading] = useState(false);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [form, setForm] = useState({ name: "", description: "", total: "" });

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", total: "" });

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const { data } = await fetchPhasesByProject(projectId);
        setPhases(data);
      } catch (e) {
        console.error(e);
        toast.error("No se pudieron cargar las fases.");
      }
    })();
  }, [projectId]);

  if (!projectId) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        Primero guarda el proyecto para poder crear fases.
      </div>
    );
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre de la fase es obligatorio.");
      return;
    }

    const payload: Phase = {
      project: projectId,
      name: form.name.trim(),
      description: form.description.trim() || null,
      total: form.total.trim() === "" ? null : Number(Number(form.total).toFixed(2)),
    };

    if (payload.total !== null && Number.isNaN(payload.total)) {
      toast.error("Total debe ser un número válido.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await createPhase(payload);
      setPhases((prev) => [data, ...prev]);
      setForm({ name: "", description: "", total: "" });
      toast.success(`Fase "${data.name}" creada.`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = typeof err.response?.data === "object" ? JSON.stringify(err.response?.data) : err.message;
        toast.error(msg || "No se pudo crear la fase.");
      } else {
        toast.error("Error desconocido al crear la fase.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Phase) => {
    setEditingId(p.id!);
    setEditForm({
      name: p.name ?? "",
      description: (p.description ?? "") as string,
      total: p.total != null ? String(p.total) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", total: "" });
  };

  const saveEdit = async (id: number) => {
    const partial: Partial<Phase> = {
      name: editForm.name.trim() || undefined,
      description: editForm.description.trim() || null,
    };

    if (editForm.total.trim() === "") {
      partial.total = null;
    } else {
      const n = Number(editForm.total);
      if (Number.isNaN(n)) {
        toast.error("Total debe ser un número válido.");
        return;
      }
      partial.total = Number(n.toFixed(2));
    }

    try {
      setLoading(true);
      const { data } = await updatePhase(id, partial);
      setPhases((prev) => prev.map((ph) => (ph.id === id ? data : ph)));
      toast.success("Fase actualizada.");
      cancelEdit();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg = typeof err.response?.data === "object" ? JSON.stringify(err.response?.data) : err.message;
        toast.error(msg || "No se pudo actualizar la fase.");
      } else {
        toast.error("Error desconocido al actualizar la fase.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-xl font-semibold">Fases del proyecto</h3>

      {/* Create form */}
      <form onSubmit={onCreate} className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Nombre *</label>
          <input
            type="text"
            maxLength={100}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Excavación"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Total (opcional)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.total}
            onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="0.00"
          />
        </div>

        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            placeholder="Detalle breve"
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creando..." : "Agregar fase"}
          </button>
        </div>
      </form>

      {/* List + inline edit */}
      <div className="space-y-3">
        {phases.length === 0 ? (
          <p className="text-sm text-gray-500">Aún no hay fases para este proyecto.</p>
        ) : (
          phases.map((p) => (
            <div key={p.id} className="rounded-xl border border-gray-200 p-4">
              {editingId === p.id ? (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <input
                    type="text"
                    maxLength={100}
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nombre de la fase"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editForm.total}
                    onChange={(e) => setEditForm((f) => ({ ...f, total: e.target.value }))}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Total"
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Descripción"
                  />

                  <div className="md:col-span-3 flex gap-2">
                    <button
                      onClick={() => saveEdit(p.id!)}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      type="button"
                      disabled={loading}
                    >
                      Guardar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
                      type="button"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold">{p.name}</p>
                    <p className="text-sm text-gray-600">
                      {p.description ? p.description : <span className="italic text-gray-400">Sin descripción</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total: {p.total != null ? p.total : <span className="italic text-gray-400">—</span>}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                      type="button"
                    >
                      Editar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NewPh;
