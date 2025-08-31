import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

import type {
  Quote,
  QuoteItemPayload,
  Phase,
  SupplierMaterial,
  Material,
  PhaseMaterial,
  Supplier,
} from "../types/interfaces";


//Projects
export const fetchAllProjects = () => {
  return axios.get('http://127.0.0.1:8000/projects/')
}

export const createProject = (project: any) => {
  return axios.post('http://127.0.0.1:8000/projects/', project)
}

export const fetchProjectById = (id: number) => {
  return axios.get(`http://127.0.0.1:8000/projects/${id}/`);
};

export const updateProject = (id: number, partial: any) => {
  return axios.patch(`http://127.0.0.1:8000/projects/${id}/`, partial);
};

//Phases
export const fetchPhasesByProject = (projectId: number) => {
  return axios.get(`http://127.0.0.1:8000/phases/?project=${projectId}`);
};

export const createPhase = (phase: any) => {
  return axios.post('http://127.0.0.1:8000/phases/', phase);
};

export const updatePhase = (id: number, partial: any) => {
  return axios.patch(`http://127.0.0.1:8000/phases/${id}/`, partial);
};

export function fetchPhaseById(id: number) {
  return axios.get<Phase>(`${BASE_URL}/phases/${id}/`);
}

// ---- Quotes
export function fetchQuotesByPhase(phaseId: number) {
  // You can implement filtering in DRF: /quotes/?phase=<id>
  return axios.get(`${BASE_URL}/quotes/`, { params: { phase: phaseId } });
}

export function createQuote(payload: Quote) {
  return axios.post(`${BASE_URL}/quotes/`, payload);
}

export function createQuoteItem(payload: QuoteItemPayload) {
  // Model is QuoteSupplierMaterial; expose a simple endpoint:
  return axios.post(`${BASE_URL}/quote-items/`, payload);
}

// ---- SupplierMaterial options scoped to phase
export function fetchSupplierMaterialsByPhase(phaseId: number) {
  // Implement this filter in DRF to return SupplierMaterials whose material is linked to this phase
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`, {
    params: { phase: phaseId },
  });
}

// ---- Quick-add helpers (optional) ----
export function createMaterial(payload: Material) {
  return axios.post(`${BASE_URL}/materials/`, payload);
}

export function createPhaseMaterial(payload: PhaseMaterial) {
  return axios.post(`${BASE_URL}/phase-materials/`, payload);
}

export function createSupplier(payload: Supplier) {
  return axios.post(`${BASE_URL}/suppliers/`, payload);
}

export function createSupplierMaterial(payload: {
  supplier: string; // nit
  material: number; // id
  actual_price: number;
  unit_of_measure: string;
}) {
  return axios.post(`${BASE_URL}/supplier-materials/`, payload);
}


export function fetchAllMaterials() {
  return axios.get<Material[]>(`${BASE_URL}/materials/`);
}

// NEW: suppliers that sell a given material
export function fetchSupplierMaterialsByMaterial(materialId: number) {
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`, {
    params: { material: materialId },
  });
}