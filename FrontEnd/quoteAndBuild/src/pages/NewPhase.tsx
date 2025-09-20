// src/components/NewPh.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createPhase, fetchPhasesByProject, updatePhase , fetchPhaseIntervals, deletePhase} from "../api/calls";
import type { Phase, PhaseInterval } from "../types/interfaces";
import DisplayMaterialTable from "../components/Material/MaterialPrueba";
import PhaseIntervalForm from "./CompletePhase";
import PhaseGetIntervals from "./FetchIntervals";

type Props = {
  projectId: number | null; // parent passes this after project is created
};


const NewPhase: React.FC<Props> = ({ projectId }) => {
  // Estado para la fase recién creada
  const [createdPhase, setCreatedPhase] = useState<Phase | null>(null);

  // Estado para mostrar u ocultar el formulario de intervalos
  const [showIntervalsId, setShowIntervalsId] = useState<number | null>(null);
  // Estado para cambiar entre el modo agregar y editar
  const [actionMode, setActionMode] = useState<"create" | "edit" | null>(null);


  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [isPlanningPhase, setIsPlanningPhase] = useState(false);


  const [phases, setPhases] = useState<Phase[]>([]); // Here we establish the type of array we will work with. In this case we're using the Phase type from interfaces document

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null); // Just Establishing  the Id phase type (number or null)
  const [editForm, setEditForm] = useState({ name: "", description: "", total: 0 });  // We set info as " ". It will be filled by the user

  // Here we are saying we are working with an empty array at first, the it will be filled with users info 
  const [form, setForm] = useState({
    name: "",
    description: "",
    total: 0,
  });

  useEffect(() => {

    if (!projectId) return;
    (async () => {
      try {
        const { data } = await fetchPhasesByProject(projectId); // Here we get the bridge between the Phase we're creating and the project we were working on. 
        setPhases(data); //We set the phase with the info given 
      } catch (error) {
        console.error(error);
        toast.error("No se pudieron cargar las fases.");
      }
    })();

  }, [projectId]);

  if (!projectId) { // Allows to control the case, the project don't exists (Maybe due to it wasn't save)
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        Primero guarda el proyecto para poder crear fases.
      </div>
    );
  }

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { // If it doesn't amend info, then the field is empty 
      toast.error("El nombre de la fase es obligatorio.");
      return;
    }

    const payload: Partial<Phase> = {
      project: projectId,
      name: form.name.trim(),
      description: form.description.trim() || null,
      total: form.total,
    };

    try {
      setLoading(true); //Activate loading state
      const { data } = await createPhase(payload); // Use info writted by the user and pass it to createPhase function to create formally the phase
      setPhases((currentPhases) => [data, ...currentPhases]); // Insert new phase on the data info, preserving the other phases
      setForm({ name: "", description: "", total: 0 }); // Set form to empty, so user can insert new phases 
      toast.success(`Fase "${data.name}" creada.`);

    } catch (err: any) {

      toast.error(err?.message || "No se pudo guardar el proyecto.");

    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: Phase) => {
    setEditingId(p.id!);
    setEditForm({
      name: p.name ?? "", //Allow to edit a phase ( we receive as a parameter ) if the field is null then if field as ""
      description: p.description ?? "",
      total: p.total ?? 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null); //No form selected
    setEditForm({ name: "", description: "", total: 0 }); //Clear fields
  };

  //Build the payload to update an edit
  const saveEdit = async (id: number) => {
    const payload: Partial<Phase> = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      total: editForm.total,
    };

    try {
      setLoading(true);

      const { data } = await updatePhase(id, payload);
      setPhases((prev) => prev.map((ph) => (ph.id === id ? data : ph))); // Search for an Id coincidence, when find change old data with changes realized, else the phase is a new phase
      toast.success("Fase actualizada.");
      cancelEdit();

    } catch (err: any) {
      toast.error(err?.message || "No se pudo editar la fase.");

    } finally {
      setLoading(false);
    }
  };

  const onDeletePhase = async (p: Phase) => {
    const ok = window.confirm(`¿Seguro que deseas eliminar la fase "${p.name}"? Esta acción no se puede deshacer.`);
    if (!ok) return;

    try {
      setLoading(true);
      await deletePhase(p.id!);
      setPhases(prev => prev.filter(ph => ph.id !== p.id));
      toast.success("Fase eliminada.");
    } catch (error) {
      toast.error("No se pudo eliminar la fase.");
    } finally {
      setLoading(false);
    }
  };

  const goToPhase = (p: Phase) => {
    // Send user to SaveProject.tsx (route: /saveProject) with the chosen project id
    navigate("/saveProject/quotes", { state: { phaseId: p.id, projectId: p.project } });
  };

  // Funcion para recargar las fases después de agregar intervalos
  const reloadPhases = async () => {
    if (!projectId) return;
    try {
      const { data } = await fetchPhasesByProject(projectId);
      setPhases(data);
    } catch (error) {
      toast.error("No se pudieron actualizar las fases.");
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
              {editingId === p.id ? ( // It allows to search the phase we want edit and display fields so user can fill them 
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
                      disabled={loading} // When click in the button activates the logic to save the changes on the phase 
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

                    <button
                      onClick = {() => onDeletePhase(p)}
                      type = "button"
                      disabled = {loading}
                      title = "Eliminar fase"
                      className="ml-auto inline-flex items-center justify-center rounded-xl border border-red-600 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
                      </svg>
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
                      Total: $ {p.total != null ? p.total : <span className="italic text-gray-400">—</span>}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duración: {p.phaseDurationExecuted != null ? p.phaseDurationExecuted : <span className="italic text-gray-400">—</span>} días
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                      type="button"
                    >
                      Editar Fase
                    </button>

                    <button
                      onClick={() => goToPhase(p)}
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                      type="button"
                    >
                      Ver cotizaciones
                    </button>
                    {/* New Button for  intervals  */}
                    <button
                      onClick={() => {
                        setCreatedPhase(p); // save selected phase
                        setShowIntervalsId(p.id!); // show form 
                        setActionMode("create"); 
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      type="button"
                    >
                      Crear
                      <br/>
                      intervalos
                    </button>
                    <button
                      onClick={() => {
                        setCreatedPhase(p);
                        setShowIntervalsId(p.id!); // show form 
                        setActionMode("edit"); 
                      }}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-600 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      type="button"
                    >
                      Editar 
                      <br/>
                      intervalos
                    </button>
                    
                  </div>
                </div>
              )}
              {/* Form with intervals below */}
              {showIntervalsId ===p.id && createdPhase && createdPhase.id === p.id && actionMode === "create" && (
                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isPlanningPhase}
                      onChange={(e) => setIsPlanningPhase(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <span className="block text-sm font-medium">¿Es una fase de planeo?</span>
                  </label>

                  <PhaseIntervalForm
                    phaseId={createdPhase.id!}
                    isPlanningPhase={isPlanningPhase}  // Dinamic value according with checkbox
                    onCreated={async (interval: PhaseInterval) => {
                      toast.success("Intervalo agregado con éxito. Duración actualizada.");
                      await reloadPhases();
                      setShowIntervalsId(null);
                    }}
                    onClose={() => setShowIntervalsId(null)}
                  />
                </div>
              )}
              {showIntervalsId === p.id && createdPhase && actionMode === "edit" && (
                <PhaseGetIntervals
                  phaseId={createdPhase.id!}
                  onCreate={async (interval) => {
                    await reloadPhases();
                    setShowIntervalsId(null);
                  }}
                  onClose={() => setShowIntervalsId(null)}
                />
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NewPhase;