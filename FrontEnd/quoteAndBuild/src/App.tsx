import { Routes, Route, Link } from "react-router-dom";
import MaterialList from "./components/Carpeta/materialList";
import NewProjects from "./components/ProyectEnsayo/project";
import ProjectList from "./components/projectList/projectList";
import Titulo from "./components/Tittle/tittle";
import AppStyles from "./App.module.css";

function App() {
  return (
    <div className={AppStyles.AppContainer}>
      <nav className="app-nav">
        <Link to="/">Inicio</Link> | 
        <Link to="/materiales">Materiales</Link> | 
        <Link to="/project">Proyectos</Link>
      </nav>

      <Titulo textValue="Gloria" />

      <Routes>
        <Route path="/" element={null} />
        <Route path="/materiales" element={<MaterialList label="AlejitoPingo" />} />
        <Route path="/project" element={<ProjectList />} />
      </Routes>
    </div>
  );
}

export default App;
