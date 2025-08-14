// src/pages/ProjectDetailPage.tsx
// src/pages/ProjectDetailPage.tsx (simplificado)
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useProyecto } from "../context/proyectContext"; // para hydrateFromDjango
import type { ProjectJSON } from "../context/proyectContext";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<ProjectJSON | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const { hydrateFromDjango } = useProyecto();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/project/${id}/full/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json: ProjectJSON = await res.json();
        setData(json);
        hydrateFromDjango(json); // si quieres hidratar el contexto global
      } catch (e:any) {
        setErr(e?.message ?? "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, hydrateFromDjango]);

  if (loading) return <div>Cargando…</div>;
  if (err) return <div className="text-red-600">{err}</div>;
  if (!data) return null;  


  const phases = data.phases ?? [];

    function fmt(total: string | null | undefined): string {
        if (total == null) return "N/A";
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(parseFloat(total));
    }
  return (
    <div className="min-h-screen bg-[#f6f6f6] p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{data.name} • {data.location}</h1>
        <Link to="/" className="text-blue-600 hover:underline">← Volver</Link>
      </div>
      <div className="text-gray-700">Total proyecto: <b>{fmt(data.total)}</b></div>

      {phases.map((ph) => {
        const quotes = ph.quotes ?? [];
        return (
          <div key={ph.phase_id} className="bg-white rounded-xl shadow p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{ph.name}</h2>
              <div className="text-gray-700">Total fase: <b>{fmt(ph.total)}</b></div>
            </div>
            {ph.description && <div className="text-gray-600">{ph.description}</div>}

            <div className="space-y-3">
              {quotes.map((q) => {
                const rows = q.supplier_materials ?? [];
                return (
                  <div key={q.quote_id} className="rounded-lg border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{q.description || `Cotización #${q.quote_id}`}</div>
                      <div className="text-sm text-gray-700">{q.quote_date} • <b>{fmt(q.total)}</b></div>
                    </div>

                    <table className="w-full text-sm mt-2">
                      <thead>
                        <tr className="text-left text-gray-600">
                          <th className="py-1">SupplierMat ID</th>
                          <th className="py-1">Cantidad</th>
                          <th className="py-1">Precio Unit</th>
                          <th className="py-1">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((sm, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-1">{sm.supplier_material_id}</td>
                            <td className="py-1">{sm.quantity}</td>
                            <td className="py-1">{fmt(sm.unit_price)}</td>
                            <td className="py-1">{fmt(sm.subtotal)}</td>
                          </tr>
                        ))}
                        {rows.length === 0 && (
                          <tr><td colSpan={4} className="py-2 text-gray-500">Sin renglones</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                );
              })}
              {quotes.length === 0 && <div className="text-gray-500">Sin cotizaciones</div>}
            </div>
          </div>
        );
      })}
      {phases.length === 0 && <div className="text-gray-500">Este proyecto no tiene fases</div>}
    </div>
  );
}
