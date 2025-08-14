

import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/home";
import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/NavBar';
import ProjectView from './pages/projectView';


function App() {
  const phasesData = [
    { phase: "Planificación", status: "En progreso" },
    { phase: "Diseño", status: "Completado" },
    { phase: "Desarrollo", status: "Pendiente" },
    { phase: "Planificación", status: "En progreso" },
    { phase: "Diseño", status: "Completado" },
    { phase: "Desarrollo", status: "Pendiente" },
  ];


  const handleDelete = (index: number) => {
    console.log("Eliminar fila:", index);
    // Aquí iría la lógica para eliminar de la base de datos o del estado
  };

  

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">

    <NavBar />

      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevoProyecto" element={<NuevoProyecto/>} />
          <Route path="/contact" element={<h1>Ñañañaña</h1>} />
          <Route path="/phase" element={<ProjectView />} />

        </Routes>
      </div>

      

    </div>
  );
}; 

export default App;
