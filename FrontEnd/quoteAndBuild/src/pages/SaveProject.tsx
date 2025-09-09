// src/pages/SaveProject.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { createProject, fetchProjectById, updateProject } from "../api/calls";
import NewPhase from "./NewPhase";

// Interface for having the form of the project
type ProjectForm = {
  name: string;
  location: string;
  total: string; // usar string para el input, convertimos al enviar
  state: "inprogress" | "completed";
};

export default function SaveProject() {
  const navigate = useNavigate();


  const location = useLocation() as { state?: { projectId?: number } }; //Look for the state that we sent with navigate, so we know in which project are we looking at.

  const stateId = location?.state?.projectId; //Get the projectId safely from the location parameter.

  const [projectId, setProjectId] = useState<number | undefined>(stateId); //Set the project Id with the initial state
  const [loading, setLoading] = useState(false); //Its an state for knowing when things are loaging
  const [saving, setSaving] = useState(false); //Its the smae, but for saving

  const [form, setForm] = useState<ProjectForm>({
    name: "",
    location: "",
    total: "",
    state : "inprogress"
  });

  //Load an existent project
  useEffect(() => {
    const loadProjects = async () => {

      if (!projectId) return; //No project ID, rerutn

      try {
        setLoading(true); // It's usufull for loading page 
        
        const {data} = await fetchProjectById(projectId); //Get the project info by ID, using fetchProjectById function
        // DRF puede devolver total como string; aseguramos string en el form
        
        setForm({
          name: data.name ?? "", //If null, use rigth side
          location: data.location ?? "",
          total: data.total ?? 0,
          state: data.state ?? "inprogress",

        }); // name the data of database as we want, helps for working with these names in the frontend

      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el proyecto.");

      } finally {
        setLoading(false);
      }
    };

    loadProjects(); //Call the function from above
  }, [projectId]);
  
  //Gets the information that we are writting and saves it into the corresponding field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value })); 
  };
  
  //Build the payload to send it to the backend, it cleans the data(whitespaces, format, etc)
  const buildPayload = () => {

    const payload: any = {
      name: form.name.trim(), //
      location: form.location.trim(),
      total: form.total,
      state: form.state,
    };

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault(); //Dont send the form instatly

    if (!form.name.trim() || !form.location.trim()) { // If don't amend the form then it is empty 
      toast.error("Nombre y ubicación son obligatorios.");
      return;
    }
    
    try {
      setSaving(true);
      const payload = buildPayload(); //Call the function to build the payload

      //If we have project ID, it means we are updating
      if (projectId) {
        const { data } = await updateProject(projectId, payload);
        toast.success(`Proyecto actualizado (${data.name}).`);
      
      //Else we are creating one
      } else {
        const { data } = await createProject(payload);
        toast.success(`Proyecto creado (${data.name}).`);
        setProjectId(data.id); // Now we have an id, so we set it

      }
    } catch (err: any) {
      toast.error(err?.message || "No se pudo guardar el proyecto.");

    } finally {
      setSaving(false);
    }
  };
  const handleToggle = async () => {
    try {
      setLoading(true);
      const newState = form.state === "inprogress" ? "completed" : "inprogress";

      // actualizar backend
      if (projectId) {
        await updateProject(projectId, { ...buildPayload(), state: newState });
        toast.success(`Estado cambiado a ${newState === "completed" ? "Completado" : "En progreso"}`);
      }

      // actualizar frontend
      setForm((f) => ({ ...f, state: newState }));
    } catch (err) {
      toast.error("No se pudo cambiar el estado.");
    } finally {
      setLoading(false);
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

      {/* Project  */}
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

        <button
          type="submit"
          disabled={saving || loading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando..." : projectId ? "Guardar cambios" : "Crear proyecto"}
        </button>
      </form>
      
      {/* Project Phases */}
      <div className="mt-8">
        <NewPhase projectId={projectId ?? null} />
      </div>
      
      <div className="mt-12 flex justify-end">
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
            form.state === "completed" ? "bg-green-500" : "bg-yellow-500"
          } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {/* Selector that moves */}
          <motion.span
            animate={{
              x: form.state === "completed" ? 52 : 4,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 left-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
          >
            <AnimatePresence mode="wait" initial={false}>
              {form.state === "inprogress" ? (
                <motion.span
                  key="progress"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  🚧
                </motion.span>
              ) : (
                <motion.span
                  key="completed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  👷‍♂️
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>

          {/* Text Below */}
          <span className="absolute -bottom-6 left-0 w-full text-xs font-medium text-gray-700 text-center">
            {form.state === "completed" ? "Completado" : "En progreso"}
          </span>
        </button>
      </div>

    </div>
  );
}