import React from "react";
import styles from "./phaseTable.module.css";

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
    <div className={styles.tableContainer}> {/* <-- contenedor agregado */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.phase}</td>
              <td>{item.status}</td>
              <td>
                <button
                  className={styles.trashButton}
                  onClick={() => onDelete(index)}
                >
                  <img
                    src="TrashImage.jpeg"
                    alt="Eliminar"
                    className={styles.trashImage}
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhaseTable;



