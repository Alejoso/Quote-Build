import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { SupplierMaterial } from "../../types/interfaces";
import { fetchAllSupplierMaterials } from "../../api/calls";

export default function DisplayMaterialTable() {
  const [materials, setMaterials] = useState<SupplierMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMaterials = async () => {
      try {
        const { data } = await fetchAllSupplierMaterials();
        setMaterials(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudo cargar el proyecto.");
      } finally {
        setLoading(false);
      }
    };
    getMaterials();
  }, []);

  if (loading) return <p>Cargando materiales...</p>;

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      <thead className="bg-gray-200">
        <tr>
          <th className="border px-2 py-1">Id</th>
          <th className="border px-2 py-1">Nombre</th>
          <th className="border px-2 py-1">Categoría</th>
          <th className="border px-2 py-1">Descripción</th>
          <th className="border px-2 py-1">Proveedor</th>
          <th className="border px-2 py-1">Ubicación</th>
          <th className="border px-2 py-1">Precio Unitario</th>
          <th className="border px-2 py-1">Unidad de Medida</th>
          <th className="border px-2 py-1">Agregar a la Cotización</th>
        </tr>
      </thead>
      <tbody>
        {materials.map((m) => (
          <tr key={m.id}>
            <td className="border px-2 py-1">{m.id}</td>
            <td className="border px-2 py-1">{m.material_name}</td>
            <td className="border px-2 py-1">{m.material_category}</td>
            <td className="border px-2 py-1">{m.material_description}</td>
            <td className="border px-2 py-1">{m.supplier_name}</td>
            <td className="border px-2 py-1">{m.supplier_location}</td>
            <td className="border px-2 py-1">{m.actual_price}</td>
            <td className="border px-2 py-1">{m.unit_of_measure}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
