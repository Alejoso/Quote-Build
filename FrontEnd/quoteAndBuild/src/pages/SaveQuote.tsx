// src/pages/SaveQuote.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// API calls you should have in src/api/calls.ts
import {
  fetchPhaseById,
  fetchAllMaterials,
  fetchSupplierMaterialsByMaterial,
  fetchQuotesByPhase,
  createQuote,
  createQuoteItem,
  // Optional quick-add helpers (used by the "Agregar nuevo material a la fase" form)
  createMaterial,
  createPhaseMaterial,
  createSupplier,
  createSupplierMaterial,
} from "../api/calls";

// Types you should have in src/types/interfaces.ts
import type {
  Quote,
  SupplierMaterial,
  QuoteItemPayload,
  Phase,
  Material,
  Supplier,
} from "../types/interfaces";

type Row = {
  id: string;
  materialId: number | null;
  supplierMaterialId: number | null;
  supplierOptions: SupplierMaterial[];
  unitOfMeasure: string;
  defaultUnitPrice?: number;
  unitPrice: string; // keep as string for input
  quantity: string; // keep as string for input
};

function uid() {
  return (crypto as any)?.randomUUID?.() ?? Math.random().toString(36).slice(2);
}

function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

const SaveQuote: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const phaseId = Number(params.get("phase"));

  const [phase, setPhase] = useState<Phase | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [existingQuotes, setExistingQuotes] = useState<number>(0);

  const [quoteDate, setQuoteDate] = useState<string>(todayISO());
  const [description, setDescription] = useState<string>("");
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Table rows
  const [rows, setRows] = useState<Row[]>([
    {
      id: uid(),
      materialId: null,
      supplierMaterialId: null,
      supplierOptions: [],
      unitOfMeasure: "",
      unitPrice: "",
      quantity: "",
    },
  ]);

  // Quick-add new material to this phase (optional section)
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaMaterialName, setQaMaterialName] = useState("");
  const [qaCategory, setQaCategory] = useState("");
  const [qaSupplierNit, setQaSupplierNit] = useState("");
  const [qaSupplierName, setQaSupplierName] = useState("");
  const [qaSupplierLocation, setQaSupplierLocation] = useState("");
  const [qaSupplierType, setQaSupplierType] = useState("");
  const [qaSupplierAccount, setQaSupplierAccount] = useState("");
  const [qaUnit, setQaUnit] = useState("");
  const [qaPrice, setQaPrice] = useState("");
  const [qaEstQty, setQaEstQty] = useState("");

  useEffect(() => {
    if (!Number.isFinite(phaseId)) {
      toast.error("Fase inválida.");
      navigate(-1);
      return;
    }
    (async () => {
      try {
        const [ph, mats, qs] = await Promise.all([
          fetchPhaseById(phaseId).then((r) => r.data),
          fetchAllMaterials().then((r) => r.data),
          fetchQuotesByPhase(phaseId).then((r) => r.data),
        ]);
        setPhase(ph);
        setMaterials(mats);
        const count = Array.isArray(qs) ? qs.length : 0;
        setExistingQuotes(count);
        setIsFirst(count === 0);
      } catch (e) {
        console.error(e);
        toast.error("No se pudo cargar la información necesaria.");
      }
    })();
  }, [phaseId, navigate]);

  const grandTotal = useMemo(() => {
    return rows.reduce((sum, r) => {
      const q = Number(r.quantity);
      const up = Number(r.unitPrice);
      if (Number.isFinite(q) && Number.isFinite(up)) return sum + q * up;
      return sum;
    }, 0);
  }, [rows]);

  // Handlers for two-step picker (Material -> Supplier)
  const onSelectMaterial = async (rowId: string, materialId: number) => {
    try {
      const { data: sms } = await fetchSupplierMaterialsByMaterial(materialId);
      setRows((prev) =>
        prev.map((r) => {
          if (r.id !== rowId) return r;
          const first = sms[0];
          return {
            ...r,
            materialId,
            supplierOptions: sms,
            supplierMaterialId: first ? first.id : null,
            unitOfMeasure: first ? first.unit_of_measure : "",
            defaultUnitPrice: first ? Number(first.actual_price) : undefined,
            unitPrice:
              r.unitPrice === "" && first ? String(first.actual_price) : r.unitPrice,
          };
        })
      );
    } catch (e) {
      console.error(e);
      toast.error("No se pudieron cargar proveedores para el material.");
    }
  };

  const onSelectSupplier = (rowId: string, supplierMaterialId: number) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const sm = r.supplierOptions.find((o) => o.id === supplierMaterialId);
        return {
          ...r,
          supplierMaterialId,
          unitOfMeasure: sm?.unit_of_measure ?? r.unitOfMeasure,
          defaultUnitPrice: sm ? Number(sm.actual_price) : r.defaultUnitPrice,
          unitPrice: r.unitPrice === "" && sm ? String(sm.actual_price) : r.unitPrice,
        };
      })
    );
  };

  // Row management
  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        id: uid(),
        materialId: null,
        supplierMaterialId: null,
        supplierOptions: [],
        unitOfMeasure: "",
        unitPrice: "",
        quantity: "",
      },
    ]);

  const removeRow = (rowId: string) => setRows((prev) => prev.filter((r) => r.id !== rowId));

  // Save quote
  const saveQuote = async () => {
    if (!phase) {
      toast.error("Fase no cargada.");
      return;
    }

    const prepared: QuoteItemPayload[] = [];
    for (const r of rows) {
      if (!r.supplierMaterialId) continue; // skip empty rows
      const qty = Number(r.quantity);
      const up = Number(r.unitPrice);
      if (!Number.isFinite(qty) || !Number.isFinite(up) || qty <= 0 || up < 0) {
        toast.error("Revisa cantidades y precios de los materiales.");
        return;
      }
      prepared.push({
        quote: 0, // will be filled with created quote id
        supplierMaterial: r.supplierMaterialId,
        quantity: Number(qty.toFixed(2)),
        unit_price: Number(up.toFixed(2)),
        subtotal: Number((qty * up).toFixed(2)),
      });
    }

    if (prepared.length === 0) {
      toast.error("Agrega al menos un material a la cotización.");
      return;
    }

    try {
      setSaving(true);
      const qPayload: Quote = {
        phase: phase.id!,
        quote_date: quoteDate,
        description: description.trim() || null,
        is_first_quote: isFirst,
        total: Number(grandTotal.toFixed(2)),
      };
      const { data: q } = await createQuote(qPayload);

      for (const item of prepared) {
        await createQuoteItem({ ...item, quote: q.id });
      }

      toast.success("Cotización creada.");
      navigate(-1);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo crear la cotización.");
    } finally {
      setSaving(false);
    }
  };

  // Quick-add: create Material + link to Phase + create Supplier + SupplierMaterial, then prefill a row
  const quickAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phase) return;

    try {
      if (!qaMaterialName.trim() || !qaCategory.trim() || !qaSupplierNit.trim() || !qaSupplierName.trim()) {
        toast.error("Completa nombre de material, categoría, NIT y proveedor.");
        return;
      }
      const price = Number(qaPrice);
      const estQty = Number(qaEstQty);
      if (!Number.isFinite(price) || price <= 0) {
        toast.error("Precio inválido.");
        return;
      }

      // 1) Material
      const { data: mat } = await createMaterial({
        name: qaMaterialName.trim(),
        category: qaCategory.trim(),
        description: null,
      } as Material);

      // 2) Link to phase
      await createPhaseMaterial({
        phase: phase.id!,
        material: mat.id,
        unit_price_estimated: Number(price.toFixed(2)),
        quantity_estimated: Number((Number.isFinite(estQty) && estQty > 0 ? estQty : 1).toFixed(2)),
      });

      // 3) Supplier (upsert-like; create endpoint should 409 if duplicates; keeping simple)
      const { data: sup } = await createSupplier({
        nit: qaSupplierNit.trim(),
        name: qaSupplierName.trim(),
        location: qaSupplierLocation.trim() || "-",
        type: qaSupplierType.trim() || "-",
        bank_account: qaSupplierAccount.trim() || "-",
      } as Supplier);

      // 4) SupplierMaterial
      const { data: sm } = await createSupplierMaterial({
        supplier: sup.nit,
        material: mat.id,
        actual_price: Number(price.toFixed(2)),
        unit_of_measure: qaUnit.trim() || "UN",
      });

      // Update materials list (add if missing)
      setMaterials((prev) => (prev.some((m) => m.id === mat.id) ? prev : [mat, ...prev]));

      // Prefill a new row with created material + supplier
      setRows((prev) => [
        ...prev,
        {
          id: uid(),
          materialId: mat.id,
          supplierMaterialId: sm.id,
          supplierOptions: [
            {
              ...sm,
              supplier_name: sup.name,
              material_name: mat.name,
            },
          ],
          unitOfMeasure: sm.unit_of_measure,
          defaultUnitPrice: Number(sm.actual_price),
          unitPrice: String(sm.actual_price),
          quantity: "1",
        },
      ]);

      // Reset quick-add form
      setShowQuickAdd(false);
      setQaMaterialName("");
      setQaCategory("");
      setQaSupplierNit("");
      setQaSupplierName("");
      setQaSupplierLocation("");
      setQaSupplierType("");
      setQaSupplierAccount("");
      setQaUnit("");
      setQaPrice("");
      setQaEstQty("");

      toast.success("Material agregado a la fase.");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo agregar el material.");
    }
  };

  return (
    <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-gray-200 bg-white p-6 shadow">
      <Toaster />
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Nueva cotización</h2>
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Volver
        </button>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Fase:</span>{" "}
          {phase ? `${phase.name} (${phase.id})` : "—"}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Cotizaciones existentes:</span> {existingQuotes}
        </p>
      </div>

      {/* Header form */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Fecha</label>
          <input
            type="date"
            value={quoteDate}
            onChange={(e) => setQuoteDate(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Notas de la cotización (opcional)"
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isFirst}
            onChange={(e) => setIsFirst(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">¿Es primera cotización de esta fase?</span>
        </label>
      </div>

      {/* Items table */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Materiales</h3>
          <button
            type="button"
            onClick={addRow}
            className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Agregar fila
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-3 text-left font-medium text-gray-700">Material</th>
                <th className="px-3 text-left font-medium text-gray-700">Proveedor</th>
                <th className="px-3 text-left font-medium text-gray-700">U. Medida</th>
                <th className="px-3 text-left font-medium text-gray-700">Precio unit.</th>
                <th className="px-3 text-left font-medium text-gray-700">Cantidad</th>
                <th className="px-3 text-left font-medium text-gray-700">Subtotal</th>
                <th className="pl-3 text-left font-medium text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const qty = Number(r.quantity);
                const up = Number(r.unitPrice);
                const sub = Number.isFinite(qty) && Number.isFinite(up) ? qty * up : 0;
                return (
                  <tr key={r.id} className="border-b">
                    {/* MATERIAL */}
                    <td className="py-2 pr-3">
                      <select
                        className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        value={r.materialId ?? ""}
                        onChange={(e) => onSelectMaterial(r.id, Number(e.target.value))}
                      >
                        <option value="" disabled>
                          Selecciona material…
                        </option>
                        {materials.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* SUPPLIER (depends on material) */}
                    <td className="px-3">
                      <select
                        className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        value={r.supplierMaterialId ?? ""}
                        disabled={!r.materialId || r.supplierOptions.length === 0}
                        onChange={(e) => onSelectSupplier(r.id, Number(e.target.value))}
                      >
                        <option value="" disabled>
                          {r.materialId ? "Selecciona proveedor…" : "Selecciona material primero"}
                        </option>
                        {r.supplierOptions.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.supplier_name} ({o.unit_of_measure}) — {o.actual_price}
                          </option>
                        ))}
                      </select>
                      {!r.materialId ? null : r.supplierOptions.length === 0 ? (
                        <p className="mt-1 text-xs text-amber-600">
                          No hay proveedores para este material. Usa “Agregar nuevo material a la fase”.
                        </p>
                      ) : null}
                    </td>

                    {/* UOM */}
                    <td className="px-3">
                      <input
                        type="text"
                        value={r.unitOfMeasure}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, unitOfMeasure: e.target.value } : x))
                          )
                        }
                        className="w-28 rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="UN"
                      />
                    </td>

                    {/* Unit price */}
                    <td className="px-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={r.unitPrice}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, unitPrice: e.target.value } : x))
                          )
                        }
                        className="w-28 rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </td>

                    {/* Quantity */}
                    <td className="px-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={r.quantity}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((x) => (x.id === r.id ? { ...x, quantity: e.target.value } : x))
                          )
                        }
                        className="w-28 rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="0.00"
                      />
                    </td>

                    {/* Subtotal */}
                    <td className="px-3 tabular-nums">{sub.toFixed(2)}</td>

                    {/* Actions */}
                    <td className="pl-3">
                      <button
                        onClick={() => removeRow(r.id)}
                        className="rounded-xl bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-800 hover:bg-gray-300"
                        type="button"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    No hay filas. Agrega materiales.
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} className="py-3 text-right font-semibold">
                  Total:
                </td>
                <td className="px-3 py-3 font-semibold tabular-nums">{grandTotal.toFixed(2)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Quick add material (optional) */}
      <div className="mb-6">
        <button
          onClick={() => setShowQuickAdd((s) => !s)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          type="button"
        >
          {showQuickAdd ? "Ocultar" : "Agregar nuevo material a la fase"}
        </button>

        {showQuickAdd && (
          <form onSubmit={quickAddMaterial} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Nombre material *"
              value={qaMaterialName}
              onChange={(e) => setQaMaterialName(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Categoría *"
              value={qaCategory}
              onChange={(e) => setQaCategory(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Unidad (ej: UN, KG)"
              value={qaUnit}
              onChange={(e) => setQaUnit(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Precio *"
              value={qaPrice}
              onChange={(e) => setQaPrice(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Cant. estimada"
              value={qaEstQty}
              onChange={(e) => setQaEstQty(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Proveedor NIT *"
              value={qaSupplierNit}
              onChange={(e) => setQaSupplierNit(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Proveedor nombre *"
              value={qaSupplierName}
              onChange={(e) => setQaSupplierName(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Proveedor ubicación"
              value={qaSupplierLocation}
              onChange={(e) => setQaSupplierLocation(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Tipo proveedor"
              value={qaSupplierType}
              onChange={(e) => setQaSupplierType(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Cuenta bancaria"
              value={qaSupplierAccount}
              onChange={(e) => setQaSupplierAccount(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2"
            />
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
              >
                Guardar material y agregar a opciones
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={saveQuote}
        className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Crear cotización"}
      </button>
    </div>
  );
};

export default SaveQuote;