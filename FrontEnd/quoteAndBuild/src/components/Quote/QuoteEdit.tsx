import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import QuoteTable from "./QuoteTable";
import toast from "react-hot-toast";
import type { QuoteItem, DisplayMaterial, MaterialWithQuantity } from "../../types/interfaces";
import { fetchQuoteItems } from "../../api/calls";

export default function QuoteEdit() {
  // 👇 Recibir quoteId desde la navegación (location.state)
  const location = useLocation() as {
    state?: {
      quoteId?: number;
      phaseId?: number;
      projectId?: number;
    };
  };
  const quoteId = location?.state?.quoteId ?? -1;

  const [materialsWithQuantities, setMaterialsWithQuantities] = useState<
    MaterialWithQuantity[]
  >([]);
  const [loading, setLoading] = useState(false);

  // 👇 Cargar items de la cotización desde backend
  useEffect(() => {
    if (quoteId === -1) {
      // Nueva cotización: estado vacío
      setMaterialsWithQuantities([]);
      return;
    }

    const loadQuoteItems = async () => {
      try {
        setLoading(true);
        const response = await fetchQuoteItems(quoteId);
        const existingItems: QuoteItem[] = response.data;

        // transformar datos a MaterialWithQuantity
        const mapped: MaterialWithQuantity[] = existingItems.map((item) => ({
          id: item.supplierMaterial, // id del SupplierMaterial
          material_name: item.material_name ?? "",
          material_category: item.material_category ?? "",
          material_description: item.material_description ?? "",
          supplier_name: item.supplier_name ?? "",
          supplier_location: item.supplier_location ?? "",
          unit_of_measure: item.unit_of_measure ?? "",
          actual_price: Number(item.unit_price),
          quantity: Number(item.quantity),
          quoteItemId: item.id, // id del QuoteSupplierMaterial
        }));

        setMaterialsWithQuantities(mapped);
      } catch (err) {
        console.error(err);
        toast.error("Error al cargar la cotización");
      } finally {
        setLoading(false);
      }
    };

    loadQuoteItems();
  }, [quoteId]);

  // 👇 Transformar a DisplayMaterial (lo que usa la tabla)
  const displayMaterials: DisplayMaterial[] = materialsWithQuantities.map((m) => ({
    id: m.quoteItemId ?? m.id, // si ya existe, usar id del QuoteItem
    material_name: m.material_name,
    material_category: m.material_category,
    material_description: m.material_description,
    supplier_name: m.supplier_name,
    supplier_location: m.supplier_location,
    unit_of_measure: m.unit_of_measure,
    unit_price: m.actual_price,
    subtotal: m.actual_price * m.quantity,
  }));

  // 👇 Eliminar item en backend + frontend
  const handleRemove = async (id: number) => {
    try {
      await axios.delete(`/api/quote-items/${id}/`);
      setMaterialsWithQuantities((prev) => prev.filter((m) => m.quoteItemId !== id));
      toast.success("Item eliminado");
    } catch (err) {
      console.error(`Error eliminando el item ${id}:`, err);
      toast.error("No se pudo eliminar el item de la cotización.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Editar Cotización #{quoteId}</h2>

      {loading ? (
        <p>Cargando items...</p>
      ) : (
        <QuoteTable materials={displayMaterials} onRemove={handleRemove} />
      )}
    </div>
  );
}
