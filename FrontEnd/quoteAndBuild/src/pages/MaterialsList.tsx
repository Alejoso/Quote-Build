import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllMaterials } from "../api/calls";
import type { Material } from "../types/interfaces";

import { useMemo } from "react";


const MaterialsList: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await fetchAllMaterials();
        setMaterials(data);
      } catch (e: any) {
        setErr(e.message ?? "Error cargando materiales");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredMaterials = useMemo(() => {
          const q = query.trim().toLowerCase();
          if (!q) return materials;
          return materials.filter((m) =>
              (m.name?? "").toLowerCase().includes(q) || (m.category ?? "").toLocaleLowerCase().includes(q) 
          );
      },  [materials, query]);
          useEffect(() => {
              fetchAllMaterials();
          }, []);

  if (loading) return <div className="p-6">Cargando…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Materiales</h1>
      <form>
            <input 
                type="text"
                placeholder="Escriba el criterio por el que quiere buscar" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                >
              </input>
        </form>
      <table className="w-full text-left border rounded overflow-hidden">
        <thead className="bg-slate-100">
          <tr>
            <th className="py-2 px-3">Nombre</th>
            <th className="py-2 px-3">Categoría</th>
            <th className="py-2 px-3">Descripción</th>
            <th className="py-2 px-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((m) => (
            <tr key={m.id} className="border-b">
              <td className="py-2 px-3">{m.name}</td>
              <td className="py-2 px-3">{m.category}</td>
              <td className="py-2 px-3 text-slate-600">{m.description ?? "—"}</td>
              <td className="py-2 px-3 text-right">
                <button
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => navigate(`/materials/${m.id}/edit`)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialsList;
