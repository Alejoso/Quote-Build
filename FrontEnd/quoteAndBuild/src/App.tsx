import { useEffect } from "react";
import Button from "./components/Carpeta/materialList";
import NewProjects from "./components/ProyectEnsayo/project"; 
import { Routes, Route, Link } from 'react-router-dom'
import MaterialList from './components/Carpeta/materialList'
import ProjectsTable from './components/projectsTable/ProjectsTable';
import elementTable from './components/elementTable/elementTable'
import ProjectElement from "./components/elementTable/elementTable";
import tittle from "./components/Tittle/tittle";
import Titulo from "./components/Tittle/tittle";
import tittleStyles from './tittle.module.css'; 
import AppStyles from "./App.module.css"; 


function App() {
  async function fetchMaterials() {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/material/');
      if (!response.ok) {
        throw new Error(`Http error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data); 
    } catch (error) {
      console.error('Error fetching: ', error); 
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className={AppStyles.AppContainer}>
      <nav className="app-nav">
        <Link to="/">Inicio</Link> | 
        <Link to="/materiales">Materiales</Link> | 
        <Link to="/project">Proyectos</Link>
      </nav>
      <Titulo textValue="Sloan"/>
      <Link to="/project"><ProjectElement textValue={'casa75'}/></Link>
      <Routes>
        <Route path="/" element/>
        <Route path="/materiales" element={<MaterialList label={"AlejitoPingo"} />} />
        <Route path="/project" element={<NewProjects />} />
      </Routes>
    </div>
  );
}

export default App;