import React, { useEffect, useState } from 'react';
import { useLocation ,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Material , Phase } from '../../types/interfaces';
import { fetchProjectById, fetchPhasesByProject , fetchSupplierMaterialsByPhase , generateGraph} from '../../api/calls';

// Extender la interfaz para incluir cantidad



const ProjectGraph: React.FC = () => {
    const navigate = useNavigate(); 
    const [project , setProject] = useState<Phase[]>([]); 
    const [phases , setPhases] = useState<Phase[]>([]); 
    const [materials , setMaterials] = useState<Material[]>([]); 
    const [costs, setCosts] = useState<(number | null | undefined)[]>([]);
    const [graph , setGraph] = useState<string>(''); 
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    
    const location = useLocation() as { state?: { projectId?: number } }; //Look for the state that we sent with navigate, so we know in which project are we looking at.
    const stateId = location?.state?.projectId; //Get the projectId safely from the location parameter.
// carga el proyecto
useEffect(() => {
    if (!stateId) return;
    const getProject = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProjectById(stateId);
        setProject(data);
      } catch (error: any) {
        toast.error(error || "Ha ocurrido un problema obteniendo el proyecto");
      } finally {
        setLoading(false);
      }
    };
    getProject();
  }, [stateId]);
  
  // carga fases
  useEffect(() => {
    if (!stateId) return;
    const getAllPhases = async () => {
      try {
        setLoading(true);
        const { data } = await fetchPhasesByProject(stateId);
        setPhases(data);
      } catch (error: any) {
        toast.error(error || "Ha ocurrido un problema obteniendo las fases");
      } finally {
        setLoading(false);
      }
    };
    getAllPhases();
  }, [stateId]);
  
  // carga materiales cuando phases cambie
  useEffect(() => {
    if (!stateId || phases.length === 0) return;
    const getMaterials = async () => {
      try {
        setLoading(true);
        for (const phase of phases) {
          if (phase?.id !== undefined) {
            const { data } = await fetchSupplierMaterialsByPhase(phase.id);
            setMaterials((currentMaterials) => ({ data, ...currentMaterials
            }));
          }
        }
      } catch (error: any) {
        toast.error(error || "Ha ocurrido un problema obteniendo los materiales");
      } finally {
        setLoading(false);
      }
    };
    getMaterials();

  }, [stateId, phases]);

  useEffect(() => {

    const phaseCosts = phases.map(p => p.phaseTotalCostExecuted);
    setCosts(phaseCosts);

    const graphs = async () => {
      try {
        setLoading(true);
        const {data} = await generateGraph(costs); 
        console.log(data); 
        setGraph(data); 
      } catch (error: any) {
        toast.error(error || "Ha ocurrido un problema generando los graficos");
      } finally {
        setLoading(false);
      }
    };

    graphs();

  }, []);
    

    return (
        <div className="mx-auto max-w-5xl p-6">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex justify-between space-x-6">
          <div className="w-1/2 p-4 border rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-center mb-4">Cuota Inicial</h3>
            <ul className="space-y-4">
              {phases.map((phase) => (
                <li key={phase.id} className="border-b py-2">
                  <strong>{phase.name}</strong>
                  <div>Costo Planificado: ${phase.phaseTotalCostPlanned ?? '—'}</div>
                  <div>Duración Planificada: {phase.phaseDurationPlanning ?? '—'} días</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-1/2 p-4 border rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-center mb-4">Cuota Final</h3>
            <ul className="space-y-4">
              {phases.map((phase) => (
                <li key={phase.id} className="border-b py-2">
                  <strong>{phase.name}</strong>
                  <div>Costo Ejecutado: ${phase.phaseTotalCostExecuted ?? '—'}</div>
                  <div>Duración Ejecutada: {phase.phaseDurationExecuted ?? '—'} días</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

    <div
        className="graph-container"
        dangerouslySetInnerHTML={{ __html: graph }}
    />
    </div>
    );
};

export default ProjectGraph;