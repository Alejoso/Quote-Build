import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Phase } from '../../types/interfaces';
import { object } from 'framer-motion/client';
import BarChartCosts from '../Graph/GraphCosts';
import LineChart from '../Graph/GraphPhaseTimeCost';

interface PhaseGraphProps {
  phase: Phase; // Ahora solo recibe UNA fase
}

const PhaseGraph: React.FC<PhaseGraphProps> = ({ phase }) => {
  const navigate = useNavigate();

  interface point {
    name: string,
    cost: number,
    time: number,
  }

  const [plannedCosts , SetPlannedCosts] = useState<cost[]>()
  const [executedCosts , SetExecutedCosts] = useState<cost[]>()

  interface cost {
    name: string,
    cost: number,
  }


  const [initialPoint , SetInitialPoint] = useState<point>(); 
  const [finalPoint , SetFinalPoint] = useState<point>()

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

  if (!phase) {
    return <p className="text-gray-500">Fase no disponible.</p>;
  }

  useEffect(() => {
    const point1: point = {
      name: "Planeado",
      cost: phase.phaseTotalCostPlanned ?? 0,
      time: phase.phaseDurationPlanning ?? 0,
    };

    const point2: point = {
      name: "Ejecutado",
      cost: phase.phaseTotalCostExecuted ?? 0,
      time: phase.phaseDurationExecuted ?? 0,
    };

    SetInitialPoint(point1);
    SetFinalPoint(point2); 

    const planned: cost[] = phase.materialsCostPlanned
    ? Object.entries(phase.materialsCostPlanned).map(([name, cost]) => ({
        name,
        cost,
      }))
    : [];
  
    const initial: cost[] = phase.materialsCostExecuted
    ? Object.entries(phase.materialsCostExecuted).map(([name, cost]) => ({
        name,
        cost,
      }))
    : [];

    SetPlannedCosts(planned);
    SetExecutedCosts(initial);

  }, [phase]);


  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="border rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-center mb-6">{phase.name}</h3>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Cuota inicial</h4>
            {renderMaterialsCost(phase.materialsCostPlanned)}

            <div>
            {plannedCosts && <BarChartCosts data={plannedCosts} />}
          </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Cuota final</h4>
            {renderMaterialsCost(phase.materialsCostExecuted)}

            <div>
            {executedCosts && <BarChartCosts data={executedCosts} />}
          </div>
          </div>

          
        </div>
      </div>
      <div className="mt-6 text-center">

        <center>
          <div>
              {finalPoint && initialPoint && <LineChart data={[finalPoint , initialPoint]} />}
          </div>
        </center>

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