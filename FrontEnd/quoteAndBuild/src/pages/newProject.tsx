import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Import fuctions
import { createProject} from "../api/calls";

// Import Interfaces
import type { Project } from "../types/interfaces";


export default function newProject() {

  const [project , setProject] = useState<Project>({
    name: '',
    location: '',
    total: 0
  })



  return (
    <div>
      <h1>Nuevo projecto</h1>

      <div>
        <form>
          <div>
            <span>Name *</span>
            
            <input
              name="name"
              type="text"
              maxLength={100}
              value={project.name}
              onChange={(e) => setProject({ ...project, name: e.target.value })}
              required
              placeholder="Name of the proyect"
            />
          </div>
          <div>
            <input
              name="location"
              type="text"
              maxLength={100}
              value={project.location}
              onChange={(e) => setProject({ ...project, location: e.target.value })}
              required
              placeholder="Location of the project"
            />
          </div>
          <div>
            <input
              name="total" 
              type="number"
              maxLength={100}
              value={project.total}
              onChange={(e) => setProject({ ...project, total: e.target.value })}
              placeholder="Total $$$"
            />
          </div>

          <div>
            <button onClick={() => console.log(project)}>
              Enviar
            </button>
          </div>
        </form>
      </div>

      
    </div>
  );

}
