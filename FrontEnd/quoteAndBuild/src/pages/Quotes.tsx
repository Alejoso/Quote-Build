// src/pages/Quotes.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
    fetchQuotesByPhase,
} from "../api/calls";

type Quote = {
    id: number;
    phase: number;
    quote_date: string;      // "YYYY-MM-DD"
    description: string | null;
    is_first_quote: boolean;
    total: string | null;    // DRF may return number as string
};

type LocationState = { phaseId?: number; projectId?: number };

const Quotes: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation() as { state?: LocationState };

    const phaseId = state?.phaseId;
    const projectId = state?.projectId;

    const [loading, setLoading] = useState(false);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!phaseId) return;
        (async () => {
            try {
                setLoading(true);
                const { data } = await fetchQuotesByPhase(phaseId);
                setQuotes(data);
            } catch (err) {
                console.error(err);
                toast.error("No se pudieron cargar las cotizaciones.");
            } finally {
                setLoading(false);
            }
        })();
    }, [phaseId]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return quotes;
        return quotes.filter((qt) =>
            [
                qt.description ?? "",
                qt.quote_date ?? "",
                qt.total ?? "",
                qt.is_first_quote ? "primera" : "secundaria",
            ]
                .join(" ")
                .toLowerCase()
                .includes(q)
        );
    }, [quotes, query]);

    const goBack = () => {
        // back to project editor preserving projectId if we have it
        if (projectId) {
            navigate("/saveProject", { state: { projectId } });
        } else {
            navigate(-1);
        }
    };

    const openQuote = (quoteId: number) => {
        navigate("/saveProject/quotes/save", { state: { quoteId, phaseId, projectId } });
    };

    const newQuote = () => {
        navigate("/saveProject/quotes/save", { state: { phaseId, projectId } });
    };

    if (!phaseId) {
        return (
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
                No se recibió la fase. Vuelve e intenta de nuevo.
            </div>
        );
    }

    return (
        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
            <Toaster />
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold tracking-tight">Cotizaciones de la fase #{phaseId}</h2>
                <div className="flex gap-2">
                    <button
                        onClick={goBack}
                        className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Volver
                    </button>
                    <button
                        onClick={newQuote}
                        className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                    >
                        Nueva cotización
                    </button>
                </div>
            </div>

            <div className="mb-5">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar por fecha, descripción, total…"
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                />
                <p className="mt-2 text-xs text-gray-500">
                    {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
                </p>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 animate-pulse rounded-2xl border border-gray-200 bg-gray-100" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow">
                    <p className="text-gray-600">Aún no hay cotizaciones para esta fase.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filtered.map((q) => (
                        <div key={q.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">{q.quote_date}</p>
                                    <h3 className="text-lg font-semibold">
                                        {q.is_first_quote ? "Primera cotización" : "Cotización"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => openQuote(q.id)}
                                    className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Abrir
                                </button>
                            </div>
                            <p className="mt-2 text-sm text-gray-700">
                                {q.description ? q.description : <span className="italic text-gray-400">Sin descripción</span>}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Total: {q.total ?? "—"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Quotes;
