import React, { useState, useEffect } from "react";
import type { PhaseInterval } from "../types/interfaces";
import { fetchPhaseIntervals, updatePhaseInterval } from "../api/calls";
import toast from "react-hot-toast";

interface PhaseIntervalFormProps {
  phaseId: number;
  onCreate: (interval: PhaseInterval) => void;
  onClose: () => void;
}

export default function PhaseGetIntervals({
  phaseId,
  onCreate,
  onClose,
}: PhaseIntervalFormProps) {
  const [intervals, setIntervals] = useState<PhaseInterval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingIntervalId, setEditingIntervalId] = useState<number | null>(null);

  // Cargar intervalos de la fase seleccionada
  useEffect(() => {
    async function loadIntervals() {
      try {
        console.log("Intervalo de la phase", phaseId);
        const data = await fetchPhaseIntervals(phaseId);
        console.log("🚀 Intervalos recibidos:", data);
        setIntervals(data);
      } catch (err) {
        console.error("❌ Error al obtener intervalos:", err);
        toast.error("No se pudieron cargar los intervalos.");
      } finally {
        setLoading(false);
      }
    }

    if (phaseId) {
      setLoading(true);
      loadIntervals();
    }
  }, [phaseId]);


  const handleChange = (
    id: number,
    field: keyof PhaseInterval,
    value: string | boolean
  ) => {
    setIntervals((prev) =>
      prev.map((interval) =>
        interval.id === id ? { ...interval, [field]: value } : interval
      )
    );
  };

  // Guardar cambios de un intervalo en backend
  const handleSave = async (id: number) => {
    const interval = intervals.find((i) => i.id === id);
    if (!interval) return;

    try {
      await updatePhaseInterval(id, {
        start_date: interval.start_date ?? "",
        end_date: interval.end_date ?? "",
        reason: interval.reason ?? "",
        is_planning_phase: interval.is_planning_phase ?? false,
      });

      toast.success("Intervalo actualizado correctamente");
      onClose();
    } catch (err) {
      console.error("Error al actualizar:", err);
      toast.error("No se pudo actualizar el intervalo");
    }
  };

  if (loading) return <p>Cargando intervalos...</p>;

  return (
    <div className="space-y-4 p-4 bg-gray-100 rounded-xl mt-4">
      <h2 className="text-lg font-bold">Editar intervalos</h2>
      {(intervals || []).map((interval) => (
        <div key={interval.id} className="border p-3 rounded-lg">
          {editingIntervalId === interval.id ? (
            // Formulario de edición
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={interval.is_planning_phase || false}
                  onChange={(e) =>
                    handleChange(interval.id!, "is_planning_phase", e.target.checked)
                  }
                  className="h-4 w-4"
                />
                <span className="block text-sm font-medium">
                  ¿Es una fase de planeación?
                </span>
              </label>
              <label className="block text-sm font-medium">Fecha inicio</label>
              <input
                type="date"
                value={interval.start_date || ""}
                onChange={(e) =>
                  handleChange(interval.id!, "start_date", e.target.value)
                }
                className="border p-1 rounded w-full"
              />

              <label className="block text-sm font-medium">Fecha fin</label>
              <input
                type="date"
                value={interval.end_date || ""}
                onChange={(e) =>
                  handleChange(interval.id!, "end_date", e.target.value)
                }
                className="border p-1 rounded w-full"
              />

              <label className="block text-sm font-medium">Razón</label>
              <textarea
                value={interval.reason || ""}
                onChange={(e) =>
                  handleChange(interval.id!, "reason", e.target.value)
                }
                className="border p-1 rounded w-full"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleSave(interval.id!);
                    setEditingIntervalId(null); // Ocultar formulario después de guardar
                  }}
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingIntervalId(null)}
                  className="inline-flex items-center justify-center rounded-xl bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            // Vista de solo lectura con botón de despliegue
            <div className="flex items-center justify-between">
              <div>
                <p>
                  <strong>Inicio:</strong> {interval.start_date}
                </p>
                <p>
                  <strong>Fin:</strong> {interval.end_date || "N/A"}
                </p>
                <p>
                  <strong>Razón:</strong> {interval.reason || "N/A"}
                </p>
              </div>
              <button
                onClick={() => setEditingIntervalId(editingIntervalId === interval.id ? null : interval.id!)}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-expanded={editingIntervalId === interval.id}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${editingIntervalId === interval.id ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={onClose}
        className="mt-4 rounded-xl bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
      >
        Cerrar
      </button>
    </div>
  );
}
