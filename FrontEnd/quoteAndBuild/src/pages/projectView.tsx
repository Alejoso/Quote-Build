import React, { useState } from 'react';
import ProjectHeader from '../components/projectHeader';
import PhaseTable from '../components/phaseTable';

interface Phase {
  phase: string;
  status: string;
}

const ProjectView: React.FC = () => {
  const [phases, setPhases] = useState<Phase[]>([
    { phase: 'Fase 1', status: 'Completada' },
    { phase: 'Fase 2', status: 'En progreso' },
    { phase: 'Fase 3', status: 'Pendiente' },
  ]);

  const handleDelete = (index: number) => {
    setPhases((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <ProjectHeader projectName="Gestor de Proyecto XYZ" />
      <PhaseTable data={phases} onDelete={handleDelete} />
    </div>
  );
};

export default ProjectView;
