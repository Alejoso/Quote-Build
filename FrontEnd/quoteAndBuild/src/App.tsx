import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import Home from "./pages/home";
import NuevoProyecto from "./pages/nuevoProyecto";
import NuevaCotizacion from "./pages/nuevaCotizacion";
import Proyectos from './pages/proyectos';

export default function App() {
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
}
