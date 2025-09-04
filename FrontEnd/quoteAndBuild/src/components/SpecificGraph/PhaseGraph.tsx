import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchPhaseById } from '../../api/calls'; // Esta función debe traer la fase por su ID
import type { Phase } from '../../types/interfaces';

interface PhaseGraphProps {
  filteredPhases: Phase[]; // Recibimos las fases filtradas desde SpecificGraph.tsx
}

const PhaseGraph: React.FC<PhaseGraphProps> = ({ filteredPhases }) => {
  const [phase, setPhase] = useState<Phase | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Obtener el phaseId desde la URL
  const location = useLocation();
  const phaseId = location.state?.phaseId; // El phaseId viene del filtro

  useEffect(() => {
    const getPhase = async (id: number) => {
      setLoading(true);
      try {
        // Aquí usamos la función `fetchPhaseById` para obtener los datos de la fase
        const { data } = await fetchPhaseById(id);
        setPhase(data);
      } catch (error: any) {
        toast.error(error || 'Ha ocurrido un problema obteniendo los detalles de la fase');
      } finally {
        setLoading(false);
      }
    };

    if (phaseId) {
      getPhase(phaseId); // Obtener los detalles de la fase filtrada
    } else {
      toast.error('No se pudo cargar la fase');
    }
  }, [phaseId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!phase) {
    return (
      <div className="text-center p-6">
        <p>No se encontró información para la fase seleccionada.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="border rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-center mb-4">Detalles de la Fase</h3>
        <div>
          <h4 className="text-lg font-semibold">Nombre de la Fase:</h4>
          <p>{phase.name}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Descripción:</h4>
          <p>{phase.description ?? '—'}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Costo Planificado:</h4>
          
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Costo Ejecutado:</h4>
        
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Duración Planificada (días):</h4>
          <p>{phase.phaseDurationPlanning ?? '—'}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-lg font-semibold">Duración Ejecutada (días):</h4>
          <p>{phase.phaseDurationExecuted ?? '—'}</p>
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
