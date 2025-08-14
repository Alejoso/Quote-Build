import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Phase {
  phase: string;
  status: string;
}

interface PhaseTableProps {
  data: Phase[];
  onDelete: (index: number) => void;
}

const PhaseTable: React.FC<PhaseTableProps> = ({ data, onDelete }) => {
  return (
    <div className="bg-[#2d2d2d] text-white rounded-[12px] p-[10px] mt-[20px] overflow-auto shadow-md w-fit min-w-max mx-auto">
      <table className="border-collapse font-sans min-w-[80vw]">
        <thead>
          <tr>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Phase</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black">Status</th>
            <th className="border-2 border-black bg-gray-300 font-bold px-5 py-3 text-center text-black"></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {data.map((item, index) => (
              <motion.tr
                key={item.phase + item.status} // Clave única
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100, transition: { duration: 0.3 } }}
                layout
              >
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.phase}
                </td>
                <td className="border-2 border-black bg-gray-100 px-5 py-3 text-center text-black">
                  {item.status}
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

export default PhaseTable;
