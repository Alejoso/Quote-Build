import axios from "axios"

const API = "http://127.0.0.1:8000";
//Materials
export const fetchAllMaterials = () => {
  return axios.get('http://127.0.0.1:8000/materials/')
}

export const createMaterial = (material: any) => {
  return axios.post('http://127.0.0.1:8000/materials/', material)
}

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
// Phases
export const fetchPhasesByProject = (projectId: number) => axios.get(`${API}/phases/?project=${projectId}`);
export const fetchPhaseById = (id: number) => axios.get(`${API}/phases/${id}/`);
export const createPhase = (phase: any) => axios.post(`${API}/phases/`, phase);
export const updatePhase = (id: number, partial: any) => axios.patch(`${API}/phases/${id}/`, partial);

//Quote
export const fetchQuotesByPhase = (phaseId: number) => axios.get(`${API}/quotes/?phase=${phaseId}`);
export const createQuote = (quote: any) => axios.post(`${API}/quotes/`, quote);
export const updateQuote = (id: number, partial: any) => axios.patch(`${API}/quotes/${id}/`, partial);

