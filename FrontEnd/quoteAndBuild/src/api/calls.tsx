import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

import type {
  Quote,
  QuoteItemPayload,
  QuoteCreatePayload,
  QuoteUpdatePayload,
  Phase,
  SupplierMaterial,
  Material,
  PhaseMaterial,
  Supplier,
  Project,
  PhaseInterval
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

// ---- Quotes ----
export function fetchQuotesByPhase(phaseId: number) {
  return axios.get<Quote[]>(`${BASE_URL}/quotes/`, { params: { phase: phaseId } });
}

export function createQuote(payload: QuoteCreatePayload) {
  return axios.post<Quote>(`${BASE_URL}/quotes/`, payload);
}

export function updateQuote(id: number, payload: QuoteUpdatePayload) {
  return axios.patch<Quote>(`${BASE_URL}/quotes/${id}/`, payload);
}

export function deleteQuote(id: number) {
  return axios.delete(`${BASE_URL}/quotes/${id}/`);
}

// ---- QuoteItems ----
export function fetchQuoteItems(quoteId: number) {
  return axios.get(`${BASE_URL}/quote-items/`, {
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

// ---- SupplierMaterials ----
export function fetchAllSupplierMaterials() {
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`);
}

// NEW: suppliers that sell a given material
export function fetchSupplierMaterialsByMaterial(materialId: number) {
  return axios.get<SupplierMaterial[]>(`${BASE_URL}/supplier-materials/`, {
    params: { material: materialId },
  });
}

export function generateGraph(costs: any) {
  return axios.post<any>(`${BASE_URL}/graphs/pie/`, {   // 👈 ojo, /pie/ porque definiste @action
    costs: costs,
  });
}
