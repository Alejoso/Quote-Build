import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMaterialById,
  updateMaterial,
  fetchSupplierMaterialsForMaterial,
  updateSupplierMaterial,
  fecthAllSuppliers,
} from "../api/calls";
import type { Material, Supplier, SupplierMaterial } from "../types/interfaces";

const EditMaterial: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const materialId = Number(id);
  const navigate = useNavigate();

  // Material fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState<string>("");

  // SupplierMaterial fields
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [smList, setSmList] = useState<SupplierMaterial[]>([]);
  const [smId, setSmId] = useState<number | null>(null);         // which SupplierMaterial we’re editing
  const [supplierNit, setSupplierNit] = useState<string>("");    // current supplier nit
  const [price, setPrice] = useState<number | string>("");
  const [uom, setUom] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 1) Material
        const mres = await fetchMaterialById(materialId);
        const m: Material = mres.data;
        setName(m.name);
        setCategory(m.category);
        setDescription(m.description ?? "");

        // 2) Suppliers list (for dropdown)
        const sres = await fecthAllSuppliers();
        setSuppliers(sres.data);

        // 3) SupplierMaterial rows for this material
        const smres = await fetchSupplierMaterialsForMaterial(materialId);
        const list = smres.data;
        setSmList(list);

        // choose first link by default (or keep last chosen if navigating back)
        if (list.length > 0) {
          const first = list[0];
          setSmId(first.id);
          setSupplierNit(first.supplier as unknown as string); // DRF returns ID by default; ensure types match your interface
          setPrice(Number(first.actual_price));
          setUom(first.unit_of_measure);
        } else {
          // If none exists yet, leave fields blank; you could allow creating one instead.
          setSmId(null);
        }
      } catch (e: any) {
        setErr(e.message ?? "No se pudo cargar el material");
      } finally {
        setLoading(false);
      }
    })();
  }, [materialId]);

  const supplierName = useMemo(
    () => suppliers.find(s => s.nit === supplierNit)?.name ?? "",
    [suppliers, supplierNit]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setErr(null);

      // 1) Update material core fields
      await updateMaterial(materialId, { name, category, description });

      // 2) Update supplier-material fields (if a link exists)
      if (smId != null) {
        // You can also allow changing the supplier of this link.
        await updateSupplierMaterial(smId, {
          supplier: supplierNit,            // nit
          actual_price: Number(price),
          unit_of_measure: uom,
        });
      }
      // If there was no SupplierMaterial link, you could create one with createSupplierMaterial()

      navigate("/materials", { replace: true });
    } catch (e: any) {
      // handle uniqueness errors (supplier+material must be unique)
      setErr(
        e?.response?.data?.detail ??
        e?.message ??
        "Error guardando cambios"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-6">Cargando…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar material</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Material */}
        <div>
          <label className="block text-sm font-medium">Nombre del material</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={name}
                 onChange={e => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción (opcional)</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={description}
                 onChange={e => setDescription(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium">Categoría</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={category}
                 onChange={e => setCategory(e.target.value)} required />
        </div>

        {/* SupplierMaterial */}
        <div className="pt-4 border-t">
          <label className="block text-sm font-semibold mb-1">Proveedor del material</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={supplierNit}
            onChange={(e) => setSupplierNit(e.target.value)}
            disabled={smId == null && smList.length === 0}
          >
            {suppliers.map(s => (
              <option key={s.nit} value={s.nit}>
                {s.name} — {s.location}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Precio</label>
          <input
            type="number"
            step="0.01"
            className="mt-1 w-full border rounded px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Unidad de medida</label>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={uom}
            onChange={e => setUom(e.target.value)}
            placeholder="Kg, m, unidad, etc."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          <button type="button" className="px-4 py-2 rounded border" onClick={() => navigate(-1)} disabled={saving}>
            Volver
          </button>
        </div>
      </form>

      {smList.length > 1 && (
        <p className="text-xs text-slate-500 mt-4">
          Nota: este material tiene {smList.length} proveedores. Aquí estás editando el vínculo con:
          <strong> {supplierName || supplierNit}</strong>.
        </p>
      )}
    </div>
  );
};

export default EditMaterial;
