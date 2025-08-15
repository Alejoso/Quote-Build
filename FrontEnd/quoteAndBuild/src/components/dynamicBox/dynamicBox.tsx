import React from "react";

interface DynamicBoxProps {
  itemsCount: number;
  itemHeight?: number;
  children: React.ReactNode;
}

function DynamicBox({ itemsCount, itemHeight = 50, children }: DynamicBoxProps) {
  const height = itemsCount * itemHeight + 20; // +20px de margen/padding

  return (
    <div
      className="bg-[#2d2d2d] text-white rounded-[12px] p-[10px] mt-[20px] overflow-auto shadow-md w-fit min-w-max mx-auto"
      style={{ height: `${height}px` }}
    >
      {children}
    </div>
  );
}

export default DynamicBox;

