// ...existing code...
import React from "react";
import toast from "react-hot-toast";
import MaterialPrueba from "../components/Material/MaterialPrueba";
import type { SupplierMaterial } from "../types/interfaces";

export default function SaveQuote() {
  const handleAddMaterial = (material: SupplierMaterial) => {
    console.log("Material selected:", material);
    toast.success(`Material agregado: ${material.material_name}`);
    // TODO: add material to quote state / send to backend
  };

  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold tracking-tight mb-4">Guardar Cotización</h2>

      {/* Example: multiple components can be placed here.
          Below we display the MaterialPrueba component and pass an onAdd handler. */}
      <section className="mb-6">
        <h3 className="text-lg font-medium mb-2">Materiales</h3>
        <MaterialPrueba onAdd={handleAddMaterial} />
      </section>

      {/* Add other components (summary, totals, supplier selector, etc.) below */}
    </div>
  );
}