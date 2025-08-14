// src/pages/nuevoProyecto.tsx
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

  const handleCompletar = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1) Base JSON según el mapeo del contexto
      const payload = toDjangoJSON();

      // 2) Inyectar TOTALES derivados (string "1234.56")
      payload.total = getProjectTotalNum(proyecto).toFixed(2);
      payload.phases = payload.phases.map((ph, i) => {
        const faseFE = proyecto.fases[i];
        const phTotal = getPhaseTotalNum(faseFE).toFixed(2);
        const quotes = ph.quotes.map((q, j) => {
          const quoteFE = faseFE.cotizaciones[j];
          return { ...q, total: getQuoteTotalNum(quoteFE).toFixed(2) };
        });
        return { ...ph, total: phTotal, quotes };
      });

      // 3) POST a Django (ajusta ENDPOINT)

      
      const ENDPOINT = "http://127.0.0.1:8000/api/insertNewProject/"; // <-- cámbialo a tu ruta real
      console.log("PAYLOAD →", payload);
      console.log(
        JSON.stringify(payload.phases[0].quotes[0].supplier_materials, null, 2)
      );
      
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "omit", // si usas sesión/CSRF; opcional
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
      {proyecto.fases.map((fase, index) => {
        const totalFaseFmt = formatCOP(getPhaseTotalNum(fase));
        return (
          <div
            key={`${fase.id ?? "tmp"}-${index}`}
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
                onChange={(e) => updateFase(index, "nombre", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Descripción</label>
              <textarea
                value={fase.descripcion}
                onChange={(e) => updateFase(index, "descripcion", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Cotizaciones */}
            <div className="flex flex-col space-y-2">
              {fase.cotizaciones.map((c, idx) => {
                const totalCotFmt = formatCOP(getQuoteTotalNum(c));
                return (
                  <div key={idx} className="px-3 py-2 bg-orange-100 rounded-lg text-gray-800">
                    <div className="font-medium">{c.descripcion || "Sin descripción"}</div>
                    <div className="text-sm text-gray-600">
                      {c.fecha} •{" "}
                      <span className="font-semibold">{totalCotFmt}</span>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => navigate(`/fase/${fase.id ?? index}/nueva-cotizacion`)}
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
            !canSubmit || submitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {submitting ? "Enviando..." : "Completar"}
        </button>

        {errorMsg && <span className="text-red-600 text-sm">{errorMsg}</span>}
      </div>
    </div>
  );
}
