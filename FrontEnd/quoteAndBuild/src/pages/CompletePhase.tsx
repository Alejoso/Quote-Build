import React, { useState } from "react";
import type { PhaseInterval } from "../types/interfaces";
import { createPhaseInterval } from "../api/calls";

interface PhaseIntervalFormProps {
  phaseId: number;
  onCreated: (interval: PhaseInterval) => void;
  onClose: () => void;
}

export default function PhaseIntervalForm({
  phaseId,
  onCreated,
  onClose,
}: PhaseIntervalFormProps) {
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload: PhaseInterval = {
        phase: phaseId, // sent Id of the phase
        start_date: form.start_date, // string (YYYY-MM-DD)
        end_date: form.end_date || null,
        reason: form.reason || null,
      };
      const newInterval = await createPhaseInterval(payload);
      onCreated(newInterval);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-4 bg-gray-100 rounded-xl">
      <div>
        <label className="block text-sm font-medium">Fecha inicio</label>
        <input
          type="date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
          className="mt-1 w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha fin</label>
        <input
          type="date"
          value={form.end_date}
          onChange={(e) => setForm({ ...form, end_date: e.target.value })}
          className="mt-1 w-full rounded-md border p-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Razón</label>
        <textarea
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
          className="mt-1 w-full rounded-md border p-2"
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Agregar intervalo"}
        </button>
      </div>
    </form>
  );
}