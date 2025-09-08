import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProjectById, fetchPhasesByProject } from '../api/calls';
import ProjectGraph from '../components/SpecificGraph/ProjectGraph';
import PhaseGraph from '../components/SpecificGraph/PhaseGraph';

const SpecificGraph: React.FC = () => {
  const [project, setProject] = useState<any | null>(null); // Usamos any por simplicidad (debes poner el tipo adecuado)
  const [phases, setPhases] = useState<any[]>([]); // También puedes definir el tipo adecuado para las fases
  const [filteredPhases, setFilteredPhases] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>(''); // Estado para el filtro
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const stateId = location?.state?.projectId; // Obtener el projectId de los parámetros

  useEffect(() => {
    const getProject = async () => {
      if (!stateId) {
        toast.error('No se cargó ningún proyecto');
        return;
      }
      try {
        setLoading(true);
        const { data } = await fetchProjectById(stateId);
        setProject(data);
      } catch (error: any) {
        toast.error(error || 'Ha ocurrido un problema obteniendo el proyecto');
      } finally {
        setLoading(false);
      }
    };

    const getAllPhases = async () => {
      if (!stateId) {
        toast.error('No se cargó ningún proyecto');
        return;
      }
      try {
        setLoading(true);
        const { data } = await fetchPhasesByProject(stateId);
        setPhases(data);
        setFilteredPhases(data); // Inicialmente, mostramos todas las fases
      } catch (error: any) {
        toast.error(error || 'Ha ocurrido un problema obteniendo las fases');
      } finally {
        setLoading(false);
      }
    };

    getProject();
    getAllPhases();
  }, [stateId]);

  // Función de filtrado
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setFilter(value);

    // Filtrar las fases por el nombre de la fase (puedes ajustarlo para otros campos)
    const filtered = phases.filter((phase) =>
      phase.name.toLowerCase().includes(value)
    );
    setFilteredPhases(filtered);
  };

  return (
    
    <div className="mx-auto max-w-5xl p-6">
      {loading ? (
        <div>Loading...</div>
      ) : (
        
        <div>
          {/* Sección de Información general del proyecto */}
          <div className="mx-auto border rounded-xl shadow-lg p-6 w-[500px] mb-6">
            <h2 className="text-xl font-bold mb-4 text-center">Información general del proyecto</h2>
            {project ? (
              <div className="space-y-2">
                <div><span className="font-semibold">Nombre:</span> {project.name}</div>
                {project.description && (
                  <div><span className="font-semibold">Descripción:</span> {project.description}</div>
                )}
                {project.projectDurationPlanning !== null && (
                  <div><span className="font-semibold">Duracion planeada total: </span>{project.projectDurationPlanning} dias</div>
                )}
                {project.projectDurationExecuted !== null && (
                  <div><span className="font-semibold">Duracion ejecutada total: </span>{project.projectDurationExecuted} dias</div>
                )}
              </div>
            ) : (
              <div className="text-gray-500">No hay información del proyecto disponible.</div>
            )}
          </div>
          {/* Barra de Búsqueda */}
          <div className="mb-4">
            <input
              type="text"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Buscar por fase..."
              className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Mostrar el componente adecuado */}
          {filter.length === 0 ? (
            // Si no hay filtro, mostramos el componente ProjectGraph
            <ProjectGraph />
          ) : filteredPhases.length === 0 ? (
            // Si no hay coincidencias, mostramos un mensaje
            <div className="text-center text-gray-500">No se encontraron fases con ese nombre.</div>
          ) : (
            // Si hay filtro y coincidencias, mostramos el componente PhaseGraph
            <PhaseGraph phase={filteredPhases[0]} />
          )}
        </div>
      )}
    </div>
  );
};

export default SpecificGraph;