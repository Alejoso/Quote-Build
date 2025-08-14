import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">ID</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Nombre</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Precio</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Categoría</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Unidad</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Proveedor</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Ubicación</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Eliminar</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((item, index) => (
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
                  ${item.price.toFixed(2)}
                </td>
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.category}
                </td>
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.unitOfMeasure}
                </td>
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.supplier.name}
                </td>
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.supplier.location}
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
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default MaterialTable;
