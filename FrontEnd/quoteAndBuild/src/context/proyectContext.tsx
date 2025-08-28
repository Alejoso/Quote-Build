// src/context/proyectContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";

// Tipos de los objetos que utilizas en el contexto

export interface CotizacionMaterialFE {
  supplier_material_id: number;
  cantidad: number;
  precioUnitario: number;
  subtotal?: number | null;
}

export interface CotizacionFE {
  id?: number;
  descripcion: string;
  fecha: string;  // YYYY-MM-DD
  esPrimera: boolean;
  total?: number | null;  // número (o null)
  materiales: CotizacionMaterialFE[];
}

export interface FaseFE {
  id?: number | string;
  nombre: string;
  descripcion: string;
  total?: number | null;  // antes string | null (derivado)
  cotizaciones: CotizacionFE[];
}

export interface ProyectoFE {
  id?: number;
  nombre: string;
  lugar: string;
  total?: number | null;  // antes string | null (derivado)
  fases: FaseFE[];
}


/** ====== Tipos JSON Django (IN: lo que llega del backend) ====== */
export type QuoteSupplierMaterialJSONIn = {
  supplier_material_id: number;
  quantity: string;
  unit_price: string;
  subtotal?: string | null;   // puede venir, pero es derivado
};

export type QuoteJSONIn = {
  quote_id?: number;
  quote_date: string;
  description: string | null;
  is_first_quote: boolean;
  total?: string | null;      // puede venir, pero es derivado
  supplier_materials: QuoteSupplierMaterialJSONIn[];
};

export type PhaseJSONIn = {
  phase_id?: number;
  name: string;
  description: string | null;
  total?: string | null;      // puede venir, pero es derivado
  quotes: QuoteJSONIn[];
};

export type ProjectJSONIn = {
  project_id?: number;
  name: string;
  location: string;
  total?: string | null;      // puede venir, pero es derivado
  phases: PhaseJSONIn[];
};

/** ====== Tipos JSON Django (OUT: lo que enviamos al backend) ====== */
export type QuoteSupplierMaterialJSONOut = {
  supplier_material_id: number;
  quantity: string;
  unit_price: string;
  // sin subtotal
};

export type QuoteJSONOut = {
  quote_id?: number;
  quote_date: string;
  description: string | null;
  is_first_quote: boolean;
  // sin total
  supplier_materials: QuoteSupplierMaterialJSONOut[];
};

export type PhaseJSONOut = {
  phase_id?: number;
  name: string;
  description: string | null;
  // sin total
  quotes: QuoteJSONOut[];
};

export type ProjectJSONOut = {
  project_id?: number;
  name: string;
  location: string;
  // sin total
  phases: PhaseJSONOut[];
};

interface ProyectoContextType {
  proyecto: ProyectoFE;
  setProyecto: React.Dispatch<React.SetStateAction<ProyectoFE>>;

  addFase: () => void;
  updateFase: (index: number, campo: "nombre" | "descripcion", valor: string) => void;

  hydrateFromDjango: (json: ProjectJSONIn) => void;  // Cambié el tipo a ProjectJSONIn
  toDjangoJSON: () => ProjectJSONOut;  // Cambié el tipo a ProjectJSONOut
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
  s == null || s === "" ? null : Number(s);

function normalizeProject(json: ProjectJSONIn): ProyectoFE {
  return {
    id: json.project_id,
    nombre: json.name,
    lugar: json.location,
    // Podemos guardar el total que venga o dejarlo en null (derivado).
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
          // guardamos si viene; igual es derivado
          subtotal: toNum(m.subtotal),
        })),
      })),
    })),
  };
}

/** ====== De-normalización (Front -> Django) ====== */
function denormalizeProject(p: ProyectoFE): ProjectJSONOut {
  return {
    project_id: p.id,
    name: p.nombre,
    location: p.lugar,
    phases: p.fases.map(f => ({
      phase_id: f.id as number | undefined,
      name: f.nombre,
      description: f.descripcion,
      quotes: f.cotizaciones.map(c => ({
        quote_id: c.id,
        quote_date: c.fecha,
        description: c.descripcion,
        is_first_quote: c.esPrimera,
        supplier_materials: c.materiales
          .filter(m => m.supplier_material_id != null)
          .map(m => ({
            supplier_material_id: m.supplier_material_id,
            quantity: m.cantidad.toString(),
            unit_price: m.precioUnitario.toString(),
            // NO enviamos subtotal
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
      materiales?: CotizacionMaterialFE[];
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
          materiales: data.materiales ?? [],
        };

        return { ...f, cotizaciones: [...f.cotizaciones, nueva] };
      }),
    }));
  };

  /** Selectores de totales (derivados) */
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
  const hydrateFromDjango = (json: ProjectJSONIn) => setProyecto(normalizeProject(json));
  const toDjangoJSON = (): ProjectJSONOut => denormalizeProject(proyecto);
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
