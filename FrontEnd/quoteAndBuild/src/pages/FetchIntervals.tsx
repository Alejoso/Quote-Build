import React, { useState, useEffect } from "react";
import type { PhaseInterval } from "../types/interfaces";
import { fetchPhaseIntervals, updatePhaseInterval } from "../api/calls";
import toast from "react-hot-toast";

interface PhaseIntervalFormProps {
  phaseId: number;
  onCreated: (interval: PhaseInterval) => void;
  onClose: () => void;
}

export default function PhaseGetIntervals({
  phaseId,
  onCreated,
  onClose,
}: PhaseIntervalFormProps) {
  const [intervals, setIntervals] = useState<PhaseInterval[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
    <div className="space-y-6 p-4 bg-gray-100 rounded-xl mt-4">
      <h2 className="text-lg font-bold">Editar intervalos</h2>
      {(intervals || []).map((interval) => (
        <div key={interval.id} className="border p-3 rounded-lg space-y-2">
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

          

          <button
            onClick={() => handleSave(interval.id!)}
            
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Guardar cambios
          </button>
        </div>
      ))}
    </div>
  );
}
