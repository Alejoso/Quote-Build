import React from 'react';
import type { SupplierMaterial } from '../../types/interfaces';

interface QuoteTableProps {
  materials: SupplierMaterial[];
  onRemove?: (id: number) => void;
}

const QuoteTable: React.FC<QuoteTableProps> = ({ materials, onRemove }) => {
  const handleRemove = (id: number) => {
    if (onRemove) {
      onRemove(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Id</th>
            <th className="border px-2 py-1">Nombre</th>
            <th className="border px-2 py-1">Categoría</th>
            <th className="border px-2 py-1">Descripción</th>
            <th className="border px-2 py-1">Proveedor</th>
            <th className="border px-2 py-1">Ubicación</th>
            <th className="border px-2 py-1">Precio Unitario</th>
            <th className="border px-2 py-1">Unidad de Medida</th>
            <th className="border px-2 py-1">Precio Total por Item</th>
            {onRemove && <th className="border px-2 py-1">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {materials.length === 0 ? (
            <tr>
              <td colSpan={onRemove ? 10 : 9} className="border px-4 py-2 text-center">
                No hay materiales en la cotización
              </td>
            </tr>
          ) : (
            materials.map((material) => (
              <tr key={material.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1">{material.id}</td>
                <td className="border px-2 py-1">{material.material_name}</td>
                <td className="border px-2 py-1">{material.material_category}</td>
                <td className="border px-2 py-1">{material.material_description || 'N/A'}</td>
                <td className="border px-2 py-1">{material.supplier_name}</td>
                <td className="border px-2 py-1">{material.supplier_location}</td>
                <td className="border px-2 py-1">${material.actual_price}</td>
                <td className="border px-2 py-1">{material.unit_of_measure}</td>
                <td className="border px-2 py-1">${material.actual_price}</td>
                {onRemove && (
                  <td className="border px-2 py-1 text-center">
                    <button
                      onClick={() => handleRemove(material.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default QuoteTable;