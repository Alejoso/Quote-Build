export interface MaterialCatalog {
  nombre: string;
  categoria: string;
  unidad: string;
  proveedor: string;
}

export const materialCatalog: Record<number, MaterialCatalog> = {
  1: {
    nombre: "Cemento",
    categoria: "Cemento de cimentación",
    unidad: "kg",
    proveedor: "FerreteriaElPaisa • Sopetrán",
  },
  // Agrega más materiales aquí con su supplier_material_id
};
