export interface Supplier {
  nit: string;  // según el modelo es string, no number
  name: string;
  location: string;
}

export interface SupplierMaterial {
  supplier_material_id: number;
  actual_price: number;
  unit_of_measure: string;
  supplier: Supplier;
}

export interface Material {
  materialId: number;
  name: string;
  category: string;
  description?: string;
  suppliers: SupplierMaterial[];
}
