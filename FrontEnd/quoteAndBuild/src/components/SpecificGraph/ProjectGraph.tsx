import React, { useEffect, useState } from 'react';
import { useLocation ,useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Material , Phase } from '../../types/interfaces';
import { fetchProjectById, fetchPhasesByProject , fetchSupplierMaterialsByPhase} from '../../api/calls';4
import BarChartCostTime from '../Graph/GraphCostsTime';
import BarChartCosts from '../Graph/GraphCosts';
import BarChartTimes from '../Graph/GraphTimes';

const ProjectGraph: React.FC = () => {
    const navigate = useNavigate(); 
    const [project , setProject] = useState<Phase[]>([]); 
    const [phases , setPhases] = useState<Phase[]>([]); 
    const [materials , setMaterials] = useState<Material[]>([]); 
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    //Variables para los graficos de costos
    interface costs {
      name: string,
      cost: number,
    }

    const [executedCosts , SetExecutedCosts] = useState<costs[]>(); 
    const [plannedCosts , SetPlannedCosts] = useState<costs[]>(); 

    const [plannedDuration , setPlannedDuration] = useState<costs[]>(); 
    const [executedDuration , setExecutedDuration] = useState<costs[]>(); 

    const [initialRatio, SetInitialRatios] = useState<Ratio[] | undefined>(undefined); 
    const [finalRatios, SetFinalRatios] = useState<Ratio[] | undefined>(undefined); 
    
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

  interface Ratio {
    name: string, 
    ratio: number
  }

  //calculate the ratios of cost/time
  function calculateRatios(costs: costs[], durations: costs[]): Ratio[] {
    return costs.map(costItem => {
      // Buscar la duración que corresponda a la misma fase
      const durationItem = durations.find(d => d.name === costItem.name);

      // Si la encuentra y es mayor a 0, calcular ratio
      const ratio = durationItem && durationItem.cost > 0 
        ? costItem.cost / durationItem.cost 
        : 0;
      return {
        name: costItem.name,
        ratio
      };
    });
  }

  // Sacar la infromacion especifica para los graficos
  useEffect(() => {
    if (!phases || phases.length === 0) return;
  
    const executedCosts = phases.map((phase) => ({
      name: phase.name,
      cost: phase.phaseTotalCostExecuted,
      
    }));

    SetExecutedCosts(executedCosts as costs[]);

    console.log("Costo ejecutado " , executedCosts);
  
    const plannedCosts = phases.map((phase) => ({
      name: phase.name,
      cost: phase.phaseTotalCostPlanned,
    }));

    SetPlannedCosts(plannedCosts as costs[]);

    const executedDuration = phases.map((phase) => ({
      name: phase.name,
      cost: phase.phaseDurationExecuted,
    }));

    setPlannedDuration(executedDuration as costs[]);
  
    const plannedDuration = phases.map((phase) => ({
      name: phase.name,
      cost: phase.phaseDurationPlanning,
    }));

    setExecutedDuration(plannedDuration as costs[]);
    
    //Verificar que no sea nulo o undifined los campos
    const initialRatios =calculateRatios(
      plannedCosts?.filter(cost => cost.cost !== null && cost.cost !== undefined).map(cost => ({ ...cost, cost: cost.cost as number })) || [],
      plannedDuration?.filter(duration => duration.cost !== null && duration.cost !== undefined).map(duration => ({ ...duration, cost: duration.cost as number })) || []
    )

    SetInitialRatios(initialRatios); 

    const finalRatios =calculateRatios(
      executedCosts?.filter(cost => cost.cost !== null && cost.cost !== undefined).map(cost => ({ ...cost, cost: cost.cost as number })) || [],
      executedDuration?.filter(duration => duration.cost !== null && duration.cost !== undefined).map(duration => ({ ...duration, cost: duration.cost as number })) || []
    )

    SetFinalRatios(finalRatios); 


  
  }, [phases]);
  

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
            
            <div>
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico de costos
              </h1>
              {plannedCosts && <BarChartCosts data={plannedCosts} />}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico de tiempo
              </h1>
              {plannedDuration && <BarChartTimes data={plannedDuration} />}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico costo/tiempo
              </h1>
              {initialRatio && <BarChartCostTime data={initialRatio} />}
            </div>

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
              
            <div>  
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico de costos
              </h1>
              {executedCosts && <BarChartCosts data={executedCosts} />}
            </div>

            <div>  
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico de tiempo
              </h1>
              {executedDuration && <BarChartTimes data={executedDuration} />}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold text-center mb-6 mt-3">
              Gráfico costo/tiempo
              </h1>
              {finalRatios && <BarChartCostTime data={finalRatios} />}
            </div>
            
            
          </div>
        </div>
      )}
            
    
    </div>
    );
};

export default ProjectGraph;