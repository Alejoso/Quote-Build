import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Import fuctions
import { fetchPhasesByProject} from "../api/calls";
import { createPhase} from "../api/calls";

// Import Interfaces
import type { Phase } from "../types/interfaces";
import type { Project } from "../types/interfaces"; 


export default function savePhase({project} : {project : Project}) {

  async function fillNameProject(project : Project) {
    await fetchPhasesByProject(project.id!); // It goes this due to the Id cannot be null
  }
  

  //Definition of the variable phase, that is going to be fulfiled while we are doing the forms with the useState
  const [phase , setPhase] = useState<Phase>({
    project: project.name ,
    name: '',
    description: '',
    total : null
  })

  const [loading, _] = useState(false);
  
  //Function to call the backend
  async function createPhaseFront(phase:Phase) {
    await createPhase(phase);
  }

  //It is the function on charge of doing something when the form is submitted
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); //Prevent that the form is submited in a natural way, so we can controll validations

    //Check if there are not empty fields
    if(phase.name === ''){
      alert("No se le olvide llenar el nombre"); 
    } else {
      createPhaseFront(phase);  //Call the backend
      toast.success("La Fase " + phase.name + " ha sido añadido al proyecto!")

      //Clear fields
      setPhase({
        project = project.name,
        name: '',
        description: '',
        total: null
      });
    }
  }


  return (
    <div style={{ maxWidth: 520, margin: "2rem auto", padding: 16, border: "1px solid #e5e7eb", borderRadius: 10 }}>
      <div><Toaster/></div>
      <h2 style={{ margin: 0, marginBottom: 12 }}>{phase.name}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label style={{ display: "block", marginBottom: 6 }}>
          <span>Nombre de la Fase *</span>
          <input
            name="name"
            type="text"
            maxLength={100}
            value={phase.name}
            onChange={(e) => setPhase({ ...phase, name: e.target.value })} //het the value that the user is writting 
            required
            style={inputStyle}
            placeholder="e.g. Cimentación"
          />
        </label>
        <label style={{ display: "block", marginBottom: 6 }}>
          <span>Description*</span>
          <input
            name="description"
            type="text"
            maxLength={160}
            value={phase.description}
            onChange={(e) => setPhase{ ...phase, description: e.target.value })}
            required
            style={inputStyle}
            placeholder="e.g. Son las bases de la casa "
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
          {loading ? "Guardando..." : "Guardar fase"}
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

