import React, { useEffect, useState } from "react";
import MaterialTable from "./MaterialTable";

interface Supplier {
  nit: string;
  name: string;
  location: string;
}

interface SupplierMaterial {
  supplier_material_id: number;
  actual_price: number;
  unit_of_measure: string;
  supplier: Supplier;
}

interface Material {
  materialId: number;
  name: string;
  price: number;
  category: string;
  unitOfMeasure: string;
  description?: string;
  suppliers: SupplierMaterial[];
}

const MaterialContainer: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para traer datos del backend
  const fetchMaterials = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/materials/");
      if (!response.ok) {
        throw new Error("Error al obtener los materiales");
      }
      const data = await response.json();

      // Aseguramos que cada material tenga suppliers (aunque vacío)
      const materialsWithSuppliers = data.map((m: any) => ({
        ...m,
        suppliers: m.suppliers ?? [],
      }));

      setMaterials(materialsWithSuppliers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // Función para eliminar un material, recibiendo el índice del array
  const handleDelete = async (index: number) => {
    const materialToDelete = materials[index];
    try {
      const response = await fetch(
        `http://localhost:8000/api/materials/${materialToDelete.materialId}/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setMaterials((prev) => prev.filter((_, i) => i !== index));
      } else {
        alert("No se pudo eliminar el material");
      }
    } catch (err) {
      alert("Error al conectar con el servidor");
    }
  };

  if (loading) return <p>Cargando materiales...</p>;
  if (error) return <p>Error: {error}</p>;

  return <MaterialTable data={materials} onDelete={handleDelete} />;
};

export default MaterialContainer;
