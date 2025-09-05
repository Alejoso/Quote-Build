// interfaces.tsx
export interface SupplierMaterials {
  supplier: Supplier,
  material: Material,
  actual_price: number,
  unit_of_measure: string
}

export interface Project {
  id?: number,
  name: string,
  location: string,
  total: number
}

export interface Phase {
  id: number;
  project: number;               // FK
  name: string;
  description?: string | null;
  total: number;
}


export type Material = {
  id?: number;
  name: string;
  category: string;
  description?: string | null;
};

export type Supplier = {
  nit: string; // PK (string)
  name: string;
  location: string;
  type: string;
  bank_account: string;
};

export type SupplierMaterial = {
  id: number;
  supplier: string; // supplier.nit
  material: number; // material.id
  actual_price: number;
  unit_of_measure: string;

  // convenience labels sent by backend
  supplier_name?: string;
  supplier_location?: string;
  material_name?: string;
  material_category?: string;
  material_description?: string;
};


export type PhaseMaterial = {
  id?: number;
  phase: number;
  material: number;
  unit_price_estimated: number;
  quantity_estimated: number;
};

export type QuoteItemPayload = {
  quote: number;
  supplierMaterial: number; // matches model field name
  quantity: number;
  unit_price: number;
  subtotal?: number | null;
};

export interface Quote {
  id: number;
  phase: number;
  quote_date: string;           // "YYYY-MM-DD"
  description: string | null;
  is_first_quote: boolean;
  total: number | null;         // ⬅ change from `number` to `number | null`
  status?: "draft" | "completed";
}

// Payloads
export type QuoteCreatePayload = {
  phase: number;
  quote_date: string;
  description?: string | null;
  is_first_quote?: boolean;
  total?: number | null;        // optional & nullable in create
};

export type QuoteUpdatePayload = Partial<{
  quote_date: string;
  description: string | null;
  is_first_quote: boolean;
  total: number | null;
  status?: "draft" | "completed";
}>;

export interface PhaseInterval {
  id?: number;
  phase: number;                  // FK → just Id
  start_date: string;             // usar string, no Date
  end_date?: string | null;
  reason?: string | null;
  is_planning_phase: boolean; 
}



    