// src/context/proyectContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

export interface CotizacionMaterialFE {
  supplier_material_id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number | null;
}

export interface CotizacionFE {
  id?: number;
  descripcion: string;
  fecha: string;            // YYYY-MM-DD
  esPrimera: boolean;
  total?: number | null;    // número (o null)
  materiales: CotizacionMaterialFE[];
}
  
  export interface FaseFE {
    id?: number | string;
    nombre: string;
    descripcion: string;
    total?: number | null;      // antes string | null (derivado)
    cotizaciones: CotizacionFE[];
  }
  
  export interface ProyectoFE {
    id?: number;
    nombre: string;
    lugar: string;
    total?: number | null;      // antes string | null (derivado)
    fases: FaseFE[];
  }
  

/** ====== Tipos JSON Django (EN) ====== */
export type QuoteSupplierMaterialJSON = {
  supplier_material_id: number;
  quantity: string;
  unit_price: string;
  subtotal?: string | null;
};

export type QuoteJSON = {
  quote_id?: number;
  quote_date: string;
  description: string | null;
  is_first_quote: boolean;
  total?: string | null;
  supplier_materials: QuoteSupplierMaterialJSON[];
};

export type PhaseJSON = {
  phase_id?: number;
  name: string;
  description: string | null;
  total?: string | null;
  quotes: QuoteJSON[];
};

export type ProjectJSON = {
  project_id?: number;
  name: string;
  location: string;
  total?: string | null;
  phases: PhaseJSON[];
};

interface ProyectoContextType {
  proyecto: ProyectoFE;
  setProyecto: React.Dispatch<React.SetStateAction<ProyectoFE>>;

  addFase: () => void;
  updateFase: (index: number, campo: "nombre" | "descripcion", valor: string) => void;

  
  hydrateFromDjango: (json: ProjectJSON) => void;
  toDjangoJSON: () => ProjectJSON;
  resetProyecto: () => void;

  addCotizacion: (
    faseId: string | number,
    data: {
      descripcion?: string | null;
      fecha: string;
      esPrimera?: boolean;
      total?: number | null;
      materiales?: CotizacionMaterialFE[];
    }
  ) => void;

  // NUEVO: selectores de totales + formato
  getQuoteTotalNum: (q: CotizacionFE) => number;
  getPhaseTotalNum: (f: FaseFE) => number;
  getProjectTotalNum: (p?: ProyectoFE) => number;
  formatCOP: (n: number) => string;     
}

const ProyectoContext = createContext<ProyectoContextType | undefined>(undefined);

const emptyProyecto: ProyectoFE = { nombre: "", lugar: "", total: null, fases: [] };

/** ====== Normalización (Django -> Front) ====== */
type DecStr = string | null | undefined;
const toNum = (s: DecStr): number | null =>
  s == null || s === "" ? null : Number(s); // seguro para "123.45"

function normalizeProject(json: ProjectJSON): ProyectoFE {
  return {
    id: json.project_id,
    nombre: json.name,
    lugar: json.location,
    total: toNum(json.total),
    fases: (json.phases ?? []).map(p => ({
      id: p.phase_id,
      nombre: p.name ?? "",
      descripcion: p.description ?? "",
      total: toNum(p.total),
      cotizaciones: (p.quotes ?? []).map(q => ({
        id: q.quote_id,
        descripcion: q.description ?? "",
        fecha: q.quote_date,
        esPrimera: q.is_first_quote,
        total: toNum(q.total),
        materiales: (q.supplier_materials ?? []).map(m => ({
          supplier_material_id: m.supplier_material_id,
          cantidad: Number(m.quantity),
          precioUnitario: Number(m.unit_price),
          subtotal: toNum(m.subtotal),
        })),
      })),
    })),
  };
}

/** ====== De-normalización (Front -> Django) ====== */
const toStr2 = (n: number | null | undefined): string | null =>
    n == null ? null : n.toFixed(2);
  
function denormalizeProject(p: ProyectoFE): ProjectJSON {
  return {
    project_id: p.id,
    name: p.nombre,
    location: p.lugar,
    total: toStr2(p.total ?? null),
    phases: p.fases.map(f => ({
      phase_id: f.id as number | undefined,
      name: f.nombre,
      description: f.descripcion,
      total: toStr2(f.total ?? null),
      quotes: f.cotizaciones.map(c => ({
        quote_id: c.id,
        quote_date: c.fecha,
        description: c.descripcion,
        is_first_quote: c.esPrimera,
        total: toStr2(c.total ?? null),
        supplier_materials: c.materiales
          // ⬇️ deja pasar SOLO los que tienen ID válido
          .filter(m => m.supplier_material_id != null)
          .map(m => ({
            supplier_material_id: m.supplier_material_id,
            quantity: m.cantidad.toString(),
            unit_price: m.precioUnitario.toString(),
            subtotal: toStr2(m.subtotal ?? null),
          })),
      })),
    })),
  };
}
  

export function ProyectoProvider({ children }: { children: ReactNode }) {
  const [proyecto, setProyecto] = useState<ProyectoFE>(emptyProyecto);

  /** Acciones */
  const addFase = () => {
    setProyecto((prev) => ({
      ...prev,
      fases: [...prev.fases, { id: undefined, nombre: "", descripcion: "", total: null, cotizaciones: [] }],
    }));
  };
  
  const updateFase = (index: number, campo: "nombre" | "descripcion", valor: string) => {
    setProyecto((prev) => {
      const fases = [...prev.fases];
      fases[index] = { ...fases[index], [campo]: valor };
      return { ...prev, fases };
    });
  };
  
  const addCotizacion = (
    faseId: string | number,
    data: {
      descripcion?: string | null;
      fecha: string;
      esPrimera?: boolean;
      total?: number | null;
      materiales?: CotizacionMaterialFE[];   // <-- NUEVO
    }
  ) => {
    setProyecto(prev => ({
      ...prev,
      fases: prev.fases.map((f, i) => {
        const match = String(f.id ?? i) === String(faseId); // id o índice (fallback)
        if (!match) return f;
  
        const nextNum = f.cotizaciones.length + 1;
        const desc = (data.descripcion ?? "").trim() || `Cuota ${nextNum}`;
        const esPrimeraFinal = data.esPrimera ?? true;
  
        const nueva: CotizacionFE = {
          id: undefined,
          descripcion: desc,
          fecha: data.fecha,
          esPrimera: esPrimeraFinal,
          total: data.total ?? null,
          materiales: data.materiales ?? [],   // <-- guardamos materiales
        };
  
        return { ...f, cotizaciones: [...f.cotizaciones, nueva] };
      }),
    }));
  };
  

  /** Selectores de totales (derivados) */
// Si la cotización trae total, úsalo; si no, intenta sumar subtotales de materiales
    const getQuoteTotalNum = (q: CotizacionFE): number => {
        if (q.total != null) return q.total;
        const sum = q.materiales.reduce((acc, m) => acc + (m.subtotal ?? 0), 0);
        return sum || 0;
    };
    
    const getPhaseTotalNum = (f: FaseFE): number =>
        f.cotizaciones.reduce((acc, q) => acc + getQuoteTotalNum(q), 0);
    
    const getProjectTotalNum = (p?: ProyectoFE): number => {
        const proj = p ?? proyecto;
        return proj.fases.reduce((acc, f) => acc + getPhaseTotalNum(f), 0);
    };
    
    // Formateo solo para UI
    const formatCOP = (n: number): string =>
        new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
  

  /** Hydrate / export */
  const hydrateFromDjango = (json: ProjectJSON) => setProyecto(normalizeProject(json));
  const toDjangoJSON = (): ProjectJSON => denormalizeProject(proyecto);
  const resetProyecto = () => setProyecto(emptyProyecto);

  return (
    <ProyectoContext.Provider
      value={{
        proyecto,
        setProyecto,
        addFase,
        updateFase,
        addCotizacion,
        hydrateFromDjango,
        toDjangoJSON,
        resetProyecto,
        getQuoteTotalNum,
        getPhaseTotalNum,
        getProjectTotalNum,
        formatCOP,
      }}
    >
      {children}
    </ProyectoContext.Provider>
  );
}

export function useProyecto() {
  const ctx = useContext(ProyectoContext);
  if (!ctx) throw new Error("useProyecto debe usarse dentro de ProyectoProvider");
  return ctx;
}
