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
    total: number | null
}

export interface Phase {
    id?: number;
    project: number;               // FK
    name: string;
    description?: string | null;
    total?: number | null;
}

export type Quote = {
    id?: number;
    phase: number;
    quote_date: string; // "YYYY-MM-DD"
    description?: string | null;
    is_first_quote: boolean;
    total?: number | null;
};
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

  // convenience labels sent by backend (recommend adding in serializer)
  supplier_name?: string;
  material_name?: string;
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