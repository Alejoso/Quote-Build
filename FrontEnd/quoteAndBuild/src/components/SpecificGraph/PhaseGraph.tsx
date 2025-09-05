import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Phase } from '../../types/interfaces';

interface PhaseGraphProps {
  phase: Phase; // Ahora solo recibe UNA fase
}

const PhaseGraph: React.FC<PhaseGraphProps> = ({ phase }) => {
  const navigate = useNavigate();

  // Helper para mostrar los diccionarios de materiales
  const renderMaterialsCost = (costDict?: { [key: string]: number }) => {
    if (!costDict || Object.keys(costDict).length === 0) {
      return <p className="text-gray-500">No hay datos.</p>;
    }
    return (
      <ul className="list-disc pl-6">
        {Object.entries(costDict).map(([key, value]) => (
          <li key={key}>
            <span className="font-semibold">{key}:</span> ${value.toLocaleString()}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="border rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6">{phase.name}</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Cuota inicial</h4>
            {renderMaterialsCost(phase.materialsCostPlanned)}
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Cuota final</h4>
            {renderMaterialsCost(phase.materialsCostExecuted)}
          </div>
        </div>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/SpecificGraph', { state: { projectId: phase.project } })}
          className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black"
        >
          Volver a Fases del Proyecto
        </button>
      </div>
    </div>
  );
};

export default PhaseGraph;