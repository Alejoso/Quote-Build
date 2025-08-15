import { useNavigate } from "react-router-dom";
import { useProyecto } from "../context/proyectContext";
import { useState } from "react";

export default function NuevoProyecto() {
  const {
    proyecto,
    setProyecto,
    addFase,
    updateFase,
    getProjectTotalNum,
    getPhaseTotalNum,
    getQuoteTotalNum,
    formatCOP,
    toDjangoJSON,
  } = useProyecto();

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalProyectoFmt = formatCOP(getProjectTotalNum(proyecto));
  const canSubmit = proyecto.nombre.trim() !== "" && proyecto.lugar.trim() !== "";

  // Para controlar desplegables por cotización
  const [expandedQuotes, setExpandedQuotes] = useState<Record<string, boolean>>({});

  const toggleQuoteExpand = (faseIndex: number, cotizacionIndex: number) => {
    const key = `${faseIndex}-${cotizacionIndex}`;
    setExpandedQuotes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleCompletar = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = toDjangoJSON();

      payload.total = getProjectTotalNum(proyecto).toFixed(2);
      payload.phases = payload.phases.map((ph, i) => {
        const faseFE = proyecto.fases[i];
        const phTotal = getPhaseTotalNum(faseFE).toFixed(2);

        const quotes = ph.quotes.map((q, j) => {
          const quoteFE = faseFE.cotizaciones[j];

          return {
            ...q,
            total: getQuoteTotalNum(quoteFE).toFixed(2),
            supplier_materials: quoteFE.materiales.map((m) => ({
              supplier_material_id: m.supplier_material_id,
              quantity: m.cantidad.toString(),
              unit_price: m.precioUnitario.toString(),
              subtotal: m.subtotal != null ? m.subtotal.toFixed(2) : null,
            })),
          };
        });

        return { ...ph, total: phTotal, quotes };
      });

      const ENDPOINT = "http://127.0.0.1:8000/api/insertNewProject/";

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "omit",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error HTTP ${res.status}`);
      }

      navigate("/");
    } catch (e: any) {
      setErrorMsg(e?.message ?? "No se pudo guardar el proyecto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-screen flex flex-col items-center justify-start pt-10 pb-20 bg-gray-100 space-y-6 px-4">
      <h1 className="text-4xl font-bold mb-2 text-gray-800">Nuevo proyecto</h1>

      <div className="text-gray-700">
        Total del proyecto (auto): <span className="font-semibold">{totalProyectoFmt}</span>
      </div>

      {/* Nombre */}
      <div className="flex flex-col w-full max-w-2xl">
        <label className="text-gray-700 mb-2 text-lg font-medium">Nombre</label>
        <input
          type="text"
          placeholder="Ingrese el nombre del proyecto"
          value={proyecto.nombre}
          onChange={(e) => setProyecto((p) => ({ ...p, nombre: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Lugar */}
      <div className="flex flex-col w-full max-w-2xl">
        <label className="text-gray-700 mb-2 text-lg font-medium">Lugar</label>
        <input
          type="text"
          placeholder="Ciudad / Dirección"
          value={proyecto.lugar}
          onChange={(e) => setProyecto((p) => ({ ...p, lugar: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Fases */}
      {proyecto.fases.map((fase, faseIndex) => {
        const totalFaseFmt = formatCOP(getPhaseTotalNum(fase));
        return (
          <div
            key={`${fase.id ?? "tmp"}-${faseIndex}`}
            className="w-full max-w-2xl p-5 bg-white rounded-xl shadow-md flex flex-col space-y-4 transform transition duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Fase</h2>
              <div className="text-gray-700 text-sm">
                Total fase: <span className="font-semibold">{totalFaseFmt}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Nombre</label>
              <input
                type="text"
                value={fase.nombre}
                onChange={(e) => updateFase(faseIndex, "nombre", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Descripción</label>
              <textarea
                value={fase.descripcion}
                onChange={(e) => updateFase(faseIndex, "descripcion", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Cotizaciones */}
            <div className="flex flex-col space-y-2">
              {fase.cotizaciones.map((c, cIndex) => {
                const totalCotFmt = formatCOP(getQuoteTotalNum(c));
                const key = `${faseIndex}-${cIndex}`;
                const isExpanded = !!expandedQuotes[key];

                return (
                  <div key={c.id ?? cIndex} className="border rounded-lg bg-orange-100 text-gray-800">
                    <button
                      type="button"
                      onClick={() => toggleQuoteExpand(faseIndex, cIndex)}
                      className="w-full flex justify-between items-center px-3 py-2 font-medium focus:outline-none"
                    >
                      <div>
                        <div className="font-semibold">Cuota {cIndex + 1}</div>
                        <div className="text-sm text-gray-600">{c.fecha}</div>
                      </div>
                      <div className="font-semibold">{totalCotFmt}</div>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-4 pt-2 text-gray-800 text-sm space-y-2">
                        <p className="font-semibold">Materiales:</p>
                        {c.materiales.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {c.materiales.map((m, iMat) => (
                              <li key={iMat}>
                                ID {m.supplier_material_id} — {m.cantidad} x {formatCOP(m.precioUnitario)} = {formatCOP(m.subtotal ?? m.cantidad * m.precioUnitario)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-600">No hay materiales en esta cotización.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={() => navigate(`/fase/${fase.id ?? faseIndex}/nueva-cotizacion`)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition transform hover:scale-105"
              >
                Añadir cotización
              </button>
            </div>
          </div>
        );
      })}

      {/* Botones inferiores */}
      <div className="flex gap-3 items-center">
        <button
          onClick={addFase}
          className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-blue-700 transition transform hover:scale-105"
        >
          Nueva fase
        </button>

        <button
          disabled={!canSubmit || submitting}
          onClick={handleCompletar}
          className={`px-6 py-3 text-white text-lg font-semibold rounded-xl shadow transition transform hover:scale-105 ${
            canSubmit && !submitting
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {submitting ? "Guardando..." : "Completar"}
        </button>
      </div>

      {errorMsg && (
        <p className="text-red-600 font-semibold mt-4 max-w-2xl">{errorMsg}</p>
      )}
    </div>
  );
}
