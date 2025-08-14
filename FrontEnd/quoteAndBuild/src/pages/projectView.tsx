import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectHeader from '../components/projectHeader';
import MaterialTable from '../components/materialTable';

interface Material {
  materialId: number;
  name: string;
  price: number;
  category: string;
  unitOfMeasure: string;
  supplier: {
    name: string;
    location: string;
    nit: number;
  };
}

const ProjectView: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Obtiene los materiales desde Django
  useEffect(() => {
    axios.get<Material[]>('http://localhost:8000/api/material/')
      .then((res) => {
        setMaterials(res.data);
      })
      .catch((err) => {
        console.error('Error fetching materials:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // ❌ Simula eliminación en el estado local (no borra en la BD todavía)
  const handleDelete = (index: number) => {
    setMaterials((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <ProjectHeader projectName="Tabla de materiales" />
      {loading ? (
        <p className="text-center text-white">Cargando materiales...</p>
      ) : (
        <MaterialTable data={materials} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default ProjectView;
