// src/pages/SavePhase.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { createQuote, fetchPhaseById, fetchQuotesByPhase } from "../api/calls";
import type { Phase, Quote } from "../types/interfaces";

type QuoteForm = {
  quote_date: string;     // YYYY-MM-DD
  description: string;
};

const SavePhase: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ phaseId?: string }>();
  const location = useLocation() as { state?: { phaseId?: number } };

  const routeId = params.phaseId ? Number(params.phaseId) : undefined;
  const stateId = location?.state?.phaseId;
  const initialPhaseId = typeof routeId === "number" && !Number.isNaN(routeId) ? routeId : stateId;

  const [phaseId, setPhaseId] = useState<number | undefined>(initialPhaseId);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<QuoteForm>({ quote_date: "", description: "" });

  // Cargar fase + quotes
  useEffect(() => {
    const run = async () => {
      if (!phaseId) return;
      try {
        setLoading(true);
        const [{ data: phaseData }, { data: quotesData }] = await Promise.all([
          fetchPhaseById(phaseId),
          fetchQuotesByPhase(phaseId),
        ]);
        setPhase(phaseData);
        // ordenar por fecha descendente
        const sorted = [...quotesData].sort(
          (a: Quote, b: Quote) => (b.quote_date > a.quote_date ? 1 : b.quote_date < a.quote_date ? -1 : 0)
        );
        setQuotes(sorted);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar la fase o sus cotizaciones.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [phaseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onCreateQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseId) {
      toast.error("Falta el identificador de la fase.");
      return;
    }
    if (!form.quote_date) {
      toast.error("La fecha de cotización es obligatoria.");
      return;
    }
    try {
      setSaving(true);
      const payload: Quote = {
        phase: phaseId,
        quote_date: form.quote_date,
        description: form.description.trim() || null,
        is_first_quote: false,      // por defecto para cumplir con el modelo
        total: null,                // opcional
      };
      const { data } = await createQuote(payload);
      setQuotes((prev) => [data, ...prev]);  // insertamos arriba
      setForm({ quote_date: "", description: "" });
      toast.success("Cotización creada.");
    } catch (err) {
      toast.error("No se pudo crear la cotización.");
    } finally {
      setSaving(false);
    }
  };

  const goToQuote = (q: Quote) => {
    // Implementarás SaveQuote luego
    navigate(`/quote/${q.id}`, { state: { quoteId: q.id } });
  };

  const title = phase ? `Fase: ${phase.name}` : "Fase";

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <Toaster />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      {/* Encabezado de la fase */}
      {loading ? (
        <div className="mb-6 h-20 animate-pulse rounded-xl bg-gray-100" />
      ) : phase ? (
        <div className="mb-6 rounded-xl border border-gray-200 p-4">
          <p className="text-base"><span className="font-semibold">Proyecto ID:</span> {phase.project.id}</p>
          <p className="text-base"><span className="font-semibold">Nombre:</span> {phase.name}</p>
          <p className="text-sm text-gray-600">
            {phase.description || <span className="italic text-gray-400">Sin descripción</span>}
          </p>
          <p className="text-sm text-gray-600">
            Total: {phase.total != null ? phase.total : <span className="italic text-gray-400">—</span>}
          </p>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
          No se encontró la fase.
        </div>
      )}

      {/* Formulario para crear nueva cotización */}
      <form onSubmit={onCreateQuote} className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha *</label>
          <input
            type="date"
            name="quote_date"
            value={form.quote_date}
            onChange={handleChange}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descripción de la cotización"
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={saving || loading || !phaseId}
            className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Creando..." : "Agregar Cotización"}
          </button>
        </div>
      </form>

      {/* Lista de cotizaciones */}
      <h3 className="mb-3 text-lg font-semibold">Cotizaciones</h3>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <p className="text-sm text-gray-500">Aún no hay cotizaciones para esta fase.</p>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <button
              key={q.id}
              onClick={() => goToQuote(q)}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-base font-medium">
                  {q.quote_date} {q.is_first_quote ? <span className="ml-2 rounded bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">Primera</span> : null}
                </p>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {q.description || <span className="italic text-gray-400">Sin descripción</span>}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Total: {q.total != null ? q.total : "—"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavePhase;