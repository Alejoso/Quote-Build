import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import MaterialList from "./components/Carpeta/materialList";
import NewProjects from "./components/ProyectEnsayo/project";
import ProjectElement from "./components/elementTable/elementTable";
import Titulo from "./components/Tittle/tittle";
import AppStyles from "./App.module.css";

function App() {
  const [proyectos, setProyectos] = useState<string[]>([]);

  async function fetchProyectos() {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quoteandbuild/");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Guardar solo los nombres de proyectos
      const nombres = data.map((item: { nombre: string }) => item.nombre);
      setProyectos(nombres);
    } catch (error) {
      console.error("Error fetching proyectos:", error);
    }
  }

  useEffect(() => {
    fetchProyectos();
  }, []);

  return (
    <div className={AppStyles.AppContainer}>
      <nav className="app-nav">
        <Link to="/">Inicio</Link> | 
        <Link to="/materiales">Materiales</Link> | 
        <Link to="/project">Proyectos</Link>
      </nav>

      <Titulo textValue="Sloan" />

      {/* Mostrar cada proyecto usando ProjectElement */}
      {proyectos.map((nombre, index) => (
        <Link to="/project" key={index}>
          <ProjectElement textValue={nombre} />
        </Link>
      ))}

      <Routes>
        <Route path="/" element />
        <Route
          path="/materiales"
          element={<MaterialList label={"AlejitoPingo"} />}
        />
        <Route path="/project" element={<NewProjects />} />
      </Routes>
    </div>
  );
}

export default App;
