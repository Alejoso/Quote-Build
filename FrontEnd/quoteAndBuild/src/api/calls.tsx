import axios from "axios"


//Materials
//Method get to fetch all materials
export const fetchAllMaterials = () => {
    return axios.get('http://127.0.0.1:8000/materials/')
}

//Method post to add a material
export const createMaterial = (material: any) => {
    return axios.post('http://127.0.0.1:8000/materials/' , material)
}

//Projects
export const fetchAllProjects = () => {
    return axios.get('http://127.0.0.1:8000/projects/')
}

export const createProject = (project: any) => {
    return axios.post('http://127.0.0.1:8000/projects/' , project)
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