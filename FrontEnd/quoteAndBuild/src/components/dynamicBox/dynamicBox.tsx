import React from "react";
import styles from "./dynamicBox.module.css";

interface DynamicBoxProps {
  itemsCount: number;       // Número de elementos
  itemHeight?: number;      // Altura en px de cada elemento (default: 50)
  children: React.ReactNode;
}

function DynamicBox({ itemsCount, itemHeight = 50, children }: DynamicBoxProps) {
  const height = itemsCount * itemHeight + 20; // +20px de padding o margen

  return (
    <div
      className={styles.DynamicBox}
      style={{ height: `${height}px` }}
    >
      {children}
    </div>
  );
}

export default DynamicBox;