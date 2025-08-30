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