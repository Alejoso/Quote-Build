// src/pages/Quotes.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { deleteQuote } from "../api/calls";

// API calls
import {
    fetchPhaseById,
    fetchQuotesByPhase,
    createQuote,
    updateQuote,
} from "../api/calls";

// Interfaces
import type {
    Phase,
    Quote,
    QuoteCreatePayload,
    QuoteUpdatePayload,
} from "../types/interfaces";

//Function for getting the date in format YYYY-mm-dd
function todayISO(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function Quotes() {
    const navigate = useNavigate();
    const location = useLocation() as { state?: { phaseId?: number; projectId?: number } }; //Get the state information from the last view

    //Consolidate the informaton into varibales
    const phaseId = location?.state?.phaseId ?? -1;
    const projectId = location?.state?.projectId ?? null;

    //Set methods for setting phases and quotes
    const [phase, setPhase] = useState<Phase | null>(null);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    // Create form state
    const [newForm, setNewForm] = useState<QuoteCreatePayload>({
        phase: phaseId,
        quote_date: todayISO(),
        description: "",
        is_first_quote: false,
    });

    // Inline edit state
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<QuoteUpdatePayload & { status?: "draft" | "completed" } | null>(null);


    //Go back to the saveProject view
    const goBack = () => {
        if (projectId) {
            navigate("/saveProject", { state: { projectId } }); //Send the current project, which is needed to load that view
        } else {
            navigate("/projects");
        }
    };

    //If the ID from a phase does not exist, send back to projects view
    useEffect(() => {
        if (phaseId === -1) {
            toast.error("Falta el id de la fase.");
            goBack();
            return;
        }

        (async () => {

            try {
                setLoading(true);
                //Get the respective phase we are looking to and its corresponding quotes
                const [responsePhases, responseQuotesByPhase] = await Promise.all([
                    fetchPhaseById(phaseId),
                    fetchQuotesByPhase(phaseId),
                ]);
                setPhase(responsePhases.data); //Update the current phase
                setQuotes(responseQuotesByPhase.data); //Update posible quotes that have been done
                setNewForm((f) => ({ ...f, phase: phaseId })); //Put into the form the current phase id

            } catch (err: any) {
                console.error(err);
                toast.error(err || "No se pudieron cargar las cotizaciones.");
            } finally {
                setLoading(false);
            }
        })();
    }, [phaseId]);

    //Logic for saying Cotizacion - Phase name
    const title = useMemo(
        () => (phase ? `Cotizaciones · ${phase.name}` : "Cotizaciones"),
        [phase]
    );

    // Create a new quote
    const onCreate = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!newForm.quote_date) {
            toast.error("La fecha es obligatoria.");
            return;
        }

        try {
            setSaving(true);

            const payload: QuoteCreatePayload = {
                phase: phaseId,
                quote_date: newForm.quote_date,
                description: newForm.description?.trim() || null,
                is_first_quote: !!newForm.is_first_quote,
            };

            const { data } = await createQuote(payload);
            setQuotes((prev) => [data, ...prev]); //Save all the quotes including the new one

            //Clearing the form
            setNewForm({
                phase: phaseId,
                quote_date: todayISO(),
                description: "",
                is_first_quote: false,
            });

            toast.success("Cotización creada.");

        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.detail || err?.message || "Error desconocido");
        } finally {
            setSaving(false);
        }
    };

    // Begin editing a quote
    const startEdit = (q: Quote) => {
        setEditingId(q.id);
        setEditForm({
            quote_date: q.quote_date,
            description: q.description ?? "",
            is_first_quote: q.is_first_quote,
            total: q.total ?? null,
            status: q.status ?? "draft",
        });
    };

    //Cancel by making forms and params null
    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    //Save the edit into the data base
    const saveEdit = async () => {
        if (!editingId || !editForm) return;

        try {
            setSaving(true);

            const payload: QuoteUpdatePayload = {
                quote_date: editForm.quote_date,
                description: (editForm.description ?? "").toString().trim() || null,
                is_first_quote: !!editForm.is_first_quote,
                total: editForm.total ?? null,
                status: editForm.status ?? "draft"
            };

            const { data } = await updateQuote(editingId, payload as any); // cast safeguards older types
            setQuotes((prev) => prev.map((q) => (q.id === editingId ? (data as Quote) : q)));
            toast.success("Cotización actualizada.");
            cancelEdit();
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.detail || err?.message || "Error desconocido");
        } finally {
            setSaving(false);
        }
    };

    const onDeleteQuote = async (q: Quote) => {
    if (q.status !== "draft") {
        toast.error("Solo se pueden eliminar cotizaciones en borrador.");
        return;
    }
    const ok = window.confirm("¿Eliminar esta cotización? Esta acción no se puede deshacer.");
    if (!ok) return;

    try {
        await deleteQuote(q.id);
        toast.success("Cotización eliminada.");
        setQuotes(prev => prev.filter(item => item.id !== q.id));
    } catch (err: any) {
        if (err?.response?.status === 409) {
            console.error(err);
            toast.error(err?.response?.data?.detail || err?.message || "Error desconocido");
        } else {
            toast.error("Error eliminando la cotización.");
        }
    }
    };


    return (
        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <div>
                <Toaster />
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={goBack}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Volver
                    </button>
                </div>
            </div>

            {/* Create form */}
            <form onSubmit={onCreate} className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Fecha *</label>
                    <input
                        type="date"
                        value={newForm.quote_date}
                        onChange={(e) => setNewForm((f) => ({ ...f, quote_date: e.target.value }))}
                        className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
                    <input
                        type="text"
                        value={(newForm.description) ?? ""}
                        onChange={(e) => setNewForm((f) => ({ ...f, description: e.target.value }))}
                        className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Detalle breve"
                    />
                </div>

                <div className="md:col-span-3 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={!!newForm.is_first_quote}
                            onChange={(e) => setNewForm((f) => ({ ...f, is_first_quote: e.target.checked }))}
                        />
                        ¿Primera cotización?
                    </label>

                    <button
                        type="submit"
                        disabled={saving}
                        className="ml-auto inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-50"
                    >
                        {saving ? "Guardando..." : "Agregar cotización"}
                    </button>
                </div>
            </form>

            {/* List */}
            {loading ? ( //While loading show 3 empty squares
                <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl border border-gray-200 bg-gray-100" />
                    ))}
                </div>
            ) : quotes.length === 0 ? ( //If there are not any quotations
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <p className="text-gray-600">Aún no hay cotizaciones para esta fase.</p>
                </div>
            ) : ( //If there are quotations
                <div className="space-y-3">
                    {quotes.map((q) => (
                        <div key={q.id} className="rounded-xl border border-gray-200 p-4">
                            {editingId === q.id ? (
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Fecha</label>
                                        <input
                                            type="date"
                                            value={editForm?.quote_date ?? ""}
                                            onChange={(e) =>
                                                setEditForm((f) => (f ? { ...f, quote_date: e.target.value } : f))
                                            }
                                            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Descripción</label>
                                        <input
                                            type="text"
                                            value={editForm?.description ?? ""}
                                            onChange={(e) =>
                                                setEditForm((f) => (f ? { ...f, description: e.target.value } : f))
                                            }
                                            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Descripción"
                                        />
                                    </div>

                                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={!!editForm?.is_first_quote}
                                            onChange={(e) =>
                                                setEditForm((f) => (f ? { ...f, is_first_quote: e.target.checked } : f))
                                            }
                                        />
                                        ¿Primera cotización?
                                    </label>
                                    
                                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={editForm?.status === "completed"}
                                            onChange={(e) => {
                                                setEditForm((f) => f ? { ...f, status: e.target.checked ? "completed" : "draft" } : f);
                                            }}
                                        />
                                        ¿Completada? 
                                    </label>
                                    

                                    <div className="md:col-span-3 flex gap-2">
                                        <button
                                            onClick={saveEdit}
                                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                            type="button"
                                            disabled={saving}
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
                            ) : ( //If we dont have an editing Id, it shows the current quotes
                                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="text-base font-semibold">
                                            {q.quote_date}
                                            {q.is_first_quote ? " · Primera" : ""}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {q.description ? q.description : (
                                                <span className="italic text-gray-400">Sin descripción</span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEdit(q)}
                                            className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
                                            type="button"
                                        >
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => onDeleteQuote(q)}
                                            disabled={q.status !== "draft"}
                                            title={q.status !== "draft" ? "Solo borradores se pueden eliminar" : "Eliminar"}
                                            className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold border ${
                                                q.status !== "draft"
                                                ? "border-gray-300 text-gray-400 cursor-not-allowed"
                                                : "border-red-600 text-red-600 hover:bg-red-50"
                                            }`}
                                            type="button"
                                            >
                                            Eliminar
                                        </button>


                                        <button
                                            onClick={() =>
                                                navigate("/saveProject/quotes/saveQuote", { state: { quoteId: q.id, phaseId, projectId } })
                                            }
                                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                            type="button"
                                        >
                                            Materiales
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
