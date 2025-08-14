// src/pages/nuevaCotizacion.tsx
import { useNavigate, useParams } from "react-router-dom";
import { useProyecto } from "../context/proyectContext";

function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export default function NuevaCotizacion() {

    const { faseId } = useParams<{ faseId: string }>();
    const { proyecto , addCotizacion } = useProyecto();

    const idx = Number.isNaN(Number(faseId)) ? undefined : Number(faseId);
    const fase =
        proyecto.fases.find(f => String(f.id) === String(faseId)) ??
        (idx !== undefined ? proyecto.fases[idx] : undefined);

    const nextNumber = (fase?.cotizaciones.length ?? 0) + 1;
    const nombreAuto = `Cuota ${nextNumber}`;

    const navigate = useNavigate();


  const handleGuardar = () => {
    if (!faseId) {
      navigate("/nuevoProyecto");
      return;
    }
    
    addCotizacion(faseId, {
      descripcion: nombreAuto,  // <- aquí usamos el nombre auto
      fecha: today(),           // fecha del sistema
      esPrimera: true,          // como pediste
      total: null,              // se calculará luego
    });
    navigate("/nuevoProyecto");
  };

  return (
    <div className="w-screen flex flex-col items-center justify-start pt-10 pb-20 bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Nueva Cotización</h1>

      <div className="flex flex-col w-full max-w-2xl space-y-4">
        <div className="text-gray-700 space-y-1">
          <div>Nombre: <span className="font-semibold">{nombreAuto}</span></div>
          <div>Total: <span className="font-semibold">Se calculará automáticamente</span></div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleGuardar}
            className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-green-700 transition transform hover:scale-105"
          >
            Guardar
          </button>

          <button
            onClick={() => navigate("/nuevoProyecto")}
            className="px-6 py-3 bg-gray-400 text-white text-lg font-semibold rounded-xl shadow hover:bg-gray-500 transition transform hover:scale-105"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
