import { useEffect, useState } from "react";
import axios from "axios";

export interface MaterialRow {
  // 👇 Asegúrate de que tu API incluya este id del SupplierMaterial
  supplierMaterialId: number;               // <-- si aún no lo devuelve tu API, agrega el campo en el serializer
  materialId: number;
  name: string;
  price: number;                            // o string si tu API devuelve Decimal
  category: string;
  unitOfMeasure: string;
  supplier: {
    name: string;
    location: string;
    nit: string;                            // puede ser string si lo guardas como CharField
  };
}

interface Props {
  apiUrl?: string;
  onPick: (row: MaterialRow) => void;       // se dispara al pulsar “Añadir”
}

export default function MaterialsBrowser({ apiUrl = "http://127.0.0.1:8000/api/material/", onPick }: Props) {
  const [materials, setMaterials] = useState<MaterialRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<MaterialRow[]>(apiUrl);
        const data = res.data.map(m => ({
          ...m,
          price: typeof m.price === "string" ? Number(m.price) : m.price,
        }));
        setMaterials(data);
      } catch (e) {
        console.error("Error fetching materials:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiUrl]);

  const filtered = q.trim()
    ? materials.filter(m =>
        [m.name, m.category, m.unitOfMeasure, m.supplier.name, m.supplier.location]
          .join(" ")
          .toLowerCase()
          .includes(q.toLowerCase())
      )
    : materials;

  if (loading) return <div className="text-gray-600">Cargando materiales…</div>;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar material, categoría, proveedor…"
          className="w-full max-w-md px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="overflow-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="text-left p-3">Nombre</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-left p-3">U. Medida</th>
              <th className="text-right p-3">Precio</th>
              <th className="text-left p-3">Proveedor/Ubicacion</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={`${m.supplierMaterialId}`} className="border-t">
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.category}</td>
                <td className="p-3">{m.unitOfMeasure}</td>
                <td className="p-3 text-right">{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(m.price)}</td>
                <td className="p-3">{m.supplier.name} • {m.supplier.location}</td>
                <td className="p-3">
                  <button
                    onClick={() => onPick(m)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                  >
                    Añadir
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td className="p-4 text-gray-500" colSpan={6}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
