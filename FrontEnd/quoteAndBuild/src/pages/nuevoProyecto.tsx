import React, { useState } from "react";

interface Fase {
  nombre: string;
  descripcion: string;
  cotizaciones: string[];
}

export default function NuevaCotizacion() {
  const [fases, setFases] = useState<Fase[]>([]);

  // Para manejar inputs temporales
  const [faseNombre, setFaseNombre] = useState("");
  const [faseDescripcion, setFaseDescripcion] = useState("");

  const handleNuevaFase = () => {
    setFases([...fases, { nombre: "", descripcion: "", cotizaciones: [] }]);
  };

  const handleAñadirCotizacion = (index: number) => {
    const nuevasFases = [...fases];
    const cotizaciones = nuevasFases[index].cotizaciones;
    cotizaciones.push(`Cotización ${cotizaciones.length + 1}`);
    nuevasFases[index].cotizaciones = cotizaciones;
    setFases(nuevasFases);
  };

  const handleNombreFaseChange = (index: number, value: string) => {
    const nuevasFases = [...fases];
    nuevasFases[index].nombre = value;
    setFases(nuevasFases);
  };

  const handleDescripcionFaseChange = (index: number, value: string) => {
    const nuevasFases = [...fases];
    nuevasFases[index].descripcion = value;
    setFases(nuevasFases);
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-start pt-10 bg-gray-100 space-y-6">
      {/* Título */}

      <h1 className="text-4xl font-bold mb-6 text-gray-800">Nuevo proyecto</h1>


      {/* Campo Nombre del Proyecto */}

      <div className="flex flex-col w-80 mb-6">

      <label className="text-gray-700 mb-2 text-lg font-medium">Nombre</label>

      <input

      type="text"

      placeholder="Ingrese el nombre del proyecto"

      className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"

      />
      </div>

      {fases.map((fase, index) => (
        <div
          key={index}
          className="w-80 p-4 bg-white rounded-lg shadow flex flex-col space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-800">Nueva fase</h2>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Nombre de la fase</label>
            <input
              type="text"
              value={fase.nombre}
              onChange={(e) => handleNombreFaseChange(index, e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 mb-1">Descripción</label>
            <textarea
              value={fase.descripcion}
              onChange={(e) => handleDescripcionFaseChange(index, e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {fase.cotizaciones.map((cot, idx) => (
              <div
                key={idx}
                className="px-3 py-2 bg-gray-200 rounded-lg text-gray-800"
              >
                {cot}
              </div>
            ))}

            <button
              onClick={() => handleAñadirCotizacion(index)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Añadir cotización
            </button>
          </div>
        </div>
      ))}

      {/* Botón para agregar nueva fase */}
      <button
        onClick={handleNuevaFase}
        className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-700 transition"
      >
        Nueva fase
      </button>
    </div>
  );
}
