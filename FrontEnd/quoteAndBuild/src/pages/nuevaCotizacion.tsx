import { useNavigate, useParams } from "react-router-dom";
import { useProyecto } from "../context/proyectContext";
import { useState } from "react";
import MaterialsBrowser, { type MaterialRow } from "../components/materialsBrowser";

function today(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// Tipo local para los renglones de la cotización
type ItemCotizacion = {
  supplier_material_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  name: string;           // para mostrar
  unitOfMeasure: string;  // para mostrar
};

export default function NuevaCotizacion() {
  const { faseId } = useParams<{ faseId: string }>();
  const { addCotizacion } = useProyecto();
  const navigate = useNavigate();

  const [items, setItems] = useState<ItemCotizacion[]>([]);

  const handlePick = (row: MaterialRow) => {
    // Evitar duplicados por supplier_material_id
    setItems(prev => {
      if (prev.some(i => i.supplier_material_id === row.supplierMaterialId)) return prev;
      const qty = 1;
      const price = Number(row.price) || 0;
      return [
        ...prev,
        {
          supplier_material_id: row.supplierMaterialId,
          quantity: qty,
          unit_price: price,
          subtotal: qty * price,
          name: row.name,
          unitOfMeasure: row.unitOfMeasure,
        },
      ];
    });
  };

  const updateQty = (idx: number, qty: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: qty, subtotal: qty * it.unit_price } : it));
  };
  const updatePrice = (idx: number, price: number) => {
    setItems(prev => prev.map((it, i) => i === idx ? { ...it, unit_price: price, subtotal: it.quantity * price } : it));
  };
  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const totalCot = items.reduce((acc, it) => acc + it.subtotal, 0);

  const handleGuardar = () => {
    if (!faseId) {
      navigate("/nuevoProyecto");
      return;
    }

    // Armamos el payload de materiales para el contexto
    const materiales = items.map(it => ({
      supplier_material_id: it.supplier_material_id,
      cantidad: it.quantity,
      precioUnitario: it.unit_price,
      subtotal: it.subtotal,
    }));

    addCotizacion(faseId, {
      descripcion: undefined,      // se autogenera "Cuota N" en el contexto si lo dejaste así
      fecha: today(),
      esPrimera: true,
      total: totalCot,                 
      materiales,
    } as any);

    // Si tu addCotizacion aún no acepta 'materiales', aquí podrías TODO: addMaterialsToLastQuote(faseId, materiales)

    navigate("/nuevoProyecto");
  };

  return (
    <div className="w-screen flex flex-col items-center justify-start pt-10 pb-20 bg-gray-100 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Nueva Cotización</h1>

      {/* Navegador de materiales */}
      <div className="w-full max-w-4xl mb-8">
        <MaterialsBrowser onPick={handlePick} />
      </div>

      {/* Items seleccionados */}
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Materiales de la cotización</h2>
          <div className="text-gray-700">
            Total: <span className="font-bold">
              {new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP"}).format(totalCot)}
            </span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-gray-500">Aún no has añadido materiales.</div>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left p-2">Material</th>
                  <th className="text-left p-2">U. Medida</th>
                  <th className="text-right p-2">Cantidad</th>
                  <th className="text-right p-2">Precio unitario</th>
                  <th className="text-right p-2">Subtotal</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => (
                  <tr key={it.supplier_material_id} className="border-t">
                    <td className="p-2">{it.name}</td>
                    <td className="p-2">{it.unitOfMeasure}</td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.quantity}
                        onChange={(e) => updateQty(idx, Number(e.target.value))}
                        className="w-28 text-right px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.unit_price}
                        onChange={(e) => updatePrice(idx, Number(e.target.value))}
                        className="w-28 text-right px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    <td className="p-2 text-right">
                      {new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP"}).format(it.subtotal)}
                    </td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => removeItem(idx)}
                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-3">
          <button
            onClick={handleGuardar}
            className="px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-xl shadow hover:bg-green-700"
          >
          Guardar cotización
          </button>
          <button
            onClick={() => navigate("/nuevoProyecto")}
            className="px-6 py-3 bg-gray-400 text-white text-lg font-semibold rounded-xl shadow hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
