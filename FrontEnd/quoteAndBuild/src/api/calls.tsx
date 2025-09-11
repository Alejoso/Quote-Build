import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

import type {
  Quote,
  QuoteItemPayload,
  QuoteUpdatePayload,
  Phase,
  SupplierMaterial,
  Material,
  PhaseMaterial,
  Supplier,
  PhaseInterval,
} from "../types/interfaces";

// ---- Projects ----
export const fetchAllProjects = () => {
  return axios.get('http://127.0.0.1:8000/projects/')
};

export const createProject = (project: any) => {
  return axios.post('http://127.0.0.1:8000/projects/', project)
};

export const updateProject = (id: number, fieldsUpdate: any) => {
  return axios.patch(`http://127.0.0.1:8000/projects/${id}/`, fieldsUpdate);
};

export const fetchProjectById = (id: number) => {
  return axios.get(`http://127.0.0.1:8000/projects/${id}/`);
};

// ---- Phases ----
export const fetchPhasesByProject = (projectId: number) => {
  return axios.get(`http://127.0.0.1:8000/phases/?project=${projectId}`); //Get info from a specific Project given a Id 
};

export const createPhase = (phase: any) => {
  return axios.post('http://127.0.0.1:8000/phases/', phase);
};

export const updatePhase = (id: number, fieldsUpdate: any) => {
  return axios.patch(`http://127.0.0.1:8000/phases/${id}/`, fieldsUpdate);
};

export const deletePhase = (id: number) => {
  return axios.delete(`${BASE_URL}/phases/${id}/`);
}

export function fetchPhaseById(id: number) {
  return axios.get<Phase>(`${BASE_URL}/phases/${id}/`); 
}
// ----- PhasesInterval --- 

export async function createPhaseInterval(payload: PhaseInterval) { // Create an interval
  const { data } = await axios.post("http://127.0.0.1:8000/phase-intervals/", payload);
  return data;
}


export async function fetchPhaseIntervals(phaseId: number) {  // List an interval phase
  const { data } = await axios.get(`http://127.0.0.1:8000/phase-intervals/?phase=${phaseId}`);
  return data;
}

export async function updatePhaseInterval(phaseIntervalId: number, fieldsUpdate: any) {
  return axios.patch(
    `http://127.0.0.1:8000/phase-intervals/${phaseIntervalId}/`,  
    fieldsUpdate
  );
}// Allow us to edit a PhaseInterval

// ---- Quotes ----
export function fetchQuotesByPhase(phaseId: number) {
  return axios.get<Quote[]>(`${BASE_URL}/quotes/`, { params: { phase: phaseId } });
}

export function createQuote(payload: any) {
  return axios.post<Quote>(`${BASE_URL}/quotes/`, payload);
}

export function updateQuote(id: number, payload: QuoteUpdatePayload) {
  return axios.patch<Quote>(`${BASE_URL}/quotes/${id}/`, payload);
}

export function deleteQuote(id: number) {
  return axios.delete(`${BASE_URL}/quotes/${id}/`);
}
// calls.ts
export async function toggleQuoteStatus(id: number, currentStatus: "draft" | "completed") {
  const newStatus = currentStatus === "draft" ? "completed" : "draft";
  const response = await axios.post<Quote>(`${BASE_URL}/quotes/${id}/set-status/`, { status: newStatus });
  return response.data;
}



// ---- QuoteItems ----
export function fetchQuoteItems(quoteId: number) {
  return axios.get<QuoteItemPayload[]>(`${BASE_URL}/quote-items/`, {
    params: { quote: quoteId },
  });
}

export function createQuoteItem(payload: QuoteItemPayload) {
  return axios.post(`${BASE_URL}/quote-items/`, payload);
}

export function updateQuoteItem(id: number, payload: Partial<QuoteItemPayload>) {
  return axios.patch(`${BASE_URL}/quote-items/${id}/`, payload);
}

export function deleteQuoteItem(id: number) {
  return axios.delete(`${BASE_URL}/quote-items/${id}/`);
}

// ---- SupplierMaterial options scoped to phase ----
export function fetchSupplierMaterialsByPhase(phaseId: number) {
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

export function fetchAllMaterials(params?: { search?: string }) {
  return axios.get<Material[]>(`${BASE_URL}/materials/`, { params });
}

export function fetchMaterialById(id: number) {
  return axios.get<Material>(`${BASE_URL}/materials/${id}/`);
}

export function updateMaterial(id: number, payload: Partial<Material>) {
  return axios.patch<Material>(`${BASE_URL}/materials/${id}/`, payload);
}

export function createSupplier(payload: Supplier) {
  return axios.post(`${BASE_URL}/suppliers/`, payload);
}

export function fecthAllSuppliers() {
  return axios.get<Supplier[]>(`${BASE_URL}/suppliers/`)
}

// ---- Supplier Phones ----
export function createSupplierPhone(payload: { supplier: string; phone: string }) {
  return axios.post(`${BASE_URL}/supplier-phones/`, payload);
}

export function createSupplierMaterial(payload: {
  supplier: string; // nit
  material: number; // id
  actual_price: number;
  unit_of_measure: string;
}) {
  return axios.post(`${BASE_URL}/supplier-materials/`, payload);
}

// ---- SupplierMaterials ----
export function fetchAllSupplierMaterials() {
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`);
}

// NEW: suppliers that sell a given material
export function fetchSupplierMaterialsByQuote(materialId: number) {
  return axios.get<QuoteItemPayload[]>(`${BASE_URL}/supplier-materials/`, {
    params: { material: materialId },
  });
}

export function fetchSupplierMaterialsForMaterial(materialId: number) {
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`, {
    params: { material: materialId },
  });
}

export function updateSupplierMaterial(id: number, payload: Partial<SupplierMaterial>) {
  return axios.patch<SupplierMaterial>(`${BASE_URL}/supplier-materials/${id}/`, payload);
}
