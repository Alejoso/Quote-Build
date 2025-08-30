export interface Supplier {
    nit: string,
    name: string,
    location: string,
    type: string,
    bank_account: string,
}


export interface Material {
    name: string,
    category: string,
    description: string,
}


export interface SupplierMaterials {
    supplier: Supplier,
    material: Material,
    actual_price: number,
    unit_of_measure: string
}

export interface Project {
    name: string,
    location: string,
    total: number | null
}

export interface Phase {
    project: Project,
    name: string,
    description: string,
    total: number | null
}

export interface Quote {
    phase: Phase,
    quote_date: string,
    description: string,
    is_first_quote: boolean,
    total: number | null,
    materials: SupplierMaterials
}

export interface QuoteSupplierMaterial {
    quote: Quote,
    supplierMaterial: SupplierMaterials,
    quantity: number,
    unit_price: number,
    subtotal: number

}

