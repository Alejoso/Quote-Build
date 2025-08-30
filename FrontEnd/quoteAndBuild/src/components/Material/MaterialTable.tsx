import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Material } from "../../types/interfaces";

interface MaterialTableProps {
  data: Material[];
  onDelete: (index: number) => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ data, onDelete }) => {
  return (
    <div className="bg-[#2d2d2d] text-white rounded-[12px] p-[10px] mt-[20px] overflow-auto shadow-md w-fit min-w-max mx-auto">
      <table className="border-collapse font-sans min-w-[80vw]">
        <thead>
          <tr>
            {["ID", "Nombre", "Categoría", "Descripción", "Proveedor", "Ubicación", "Precio Unitario", "Unidad", "Eliminar"].map(
              (title, i) => (
                <th
                  key={i}
                  className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black"
                >
                  {title}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((item, index) => {
              const firstSupplier = item.suppliers[0]; // tomar el primer proveedor
              return (
                <motion.tr
                  key={item.materialId}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                  layout
                >
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {item.materialId}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {item.name}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {item.category}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {item.description || "-"}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {firstSupplier ? firstSupplier.supplier.name : "Sin proveedor"}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {firstSupplier ? firstSupplier.supplier.location : "-"}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {firstSupplier ? `$${firstSupplier.actual_price.toFixed(2)}` : "-"}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                    {firstSupplier ? firstSupplier.unit_of_measure : "-"}
                  </td>
                  <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center">
                    <button
                      onClick={() => onDelete(index)}
                      className="flex items-center justify-center w-full h-full p-0 hover:text-red-600"
                    >
                      <img
                        src="TrashImage.jpeg"
                        alt="Eliminar"
                        className="w-5 h-5"
                      />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default MaterialTable;
