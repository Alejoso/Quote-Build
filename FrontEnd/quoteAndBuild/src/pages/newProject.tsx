import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Import fuctions
import { createProject} from "../api/calls";

// Import Interfaces
import type { Project } from "../types/interfaces";


export default function newProject() {

  //Definition of the variable project, that is going to be fulfiled while we are doing the forms with the useState
  const [project , setProject] = useState<Project>({
    name: '',
    location: '',
    total: null
  })

  const [loading, setLoading] = useState(false);
  

  //Function to call the backend
  async function createProjectFront(project:Project) {
    const response = await createProject(project);
  }

  //It is the function on charge of doing something when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //Prevent that the form is submited in a natural way, so we can controll validations

    //Check if there are not empty fields
    if(project.name === '' || project.location === '' || project.total === null){
      alert("Por favor ingrese todos los campos"); 
    } else {
      createProjectFront(project);  //Call the backend
      toast.success("El proyecto " + project.name + " ha sido añadido!")

      //Clear fields
      setProject({
        name: '',
        location: '',
        total: null
      });
    }
  }


  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
      <div><Toaster/></div>
      <h2 style={{ margin: 0, marginBottom: 12 }}>{project.name}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: "block", marginBottom: 6 }}>
          <span>Name *</span>
          <input
            name="name"
            type="text"
            maxLength={100}
            value={project.name}
            onChange={(e) => setProject({ ...project, name: e.target.value })} //het the value that the user is writting 
            required
            style={inputStyle}
            placeholder="e.g. Skyline Tower"
          />
        </label>

        <label style={{ display: "block", marginBottom: 6 }}>
          <span>Location *</span>
          <input
            name="location"
            type="text"
            maxLength={160}
            value={project.location}
            onChange={(e) => setProject({ ...project, location: e.target.value })}
            required
            style={inputStyle}
            placeholder="e.g. New York, NY"
          />
        </label>

        <label style={{ display: "block", marginBottom: 6 }}>
          <span>Total (optional)</span>
          <input
            name="total"
            type="number"
            step="0.01"
            min="0"
            value={Number(project.total)}
            onChange={(e) => setProject({ ...project, total: Number(e.target.value) })}
            style={inputStyle}
            placeholder="e.g. 1500000.00"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #111827",
            background: loading ? "#9ca3af" : "#111827",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            width: "100%",
            marginTop: 8,
          }}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 10 }}>* required</p>
    </div>

    
  );

  

};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  marginTop: 6,
  marginBottom: 12,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  outline: "none",
};

