import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/home";
import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/NavBar';
import Proyectos from "./pages/proyectos";
import NuevaCotizacion from './pages/nuevaCotizacion';

  

export default function App() {


  const handleDelete = (index: number) => {
    console.log("Eliminar fila:", index);
    // Aquí iría la lógica para eliminar de la base de datos o del estado
  };
  

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto bg-gray-100">
      <NavBar />
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevoProyecto" element={<NuevoProyecto />} />
          <Route path="/fase/:faseId/nueva-cotizacion" element={<NuevaCotizacion />} />
          <Route path="/nuevoProyecto" element={<NuevoProyecto/>} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/contact" element={<h1>Ñañañaña</h1>} />
        </Routes>
      </div>

      

    </div>
  );
}; 


