import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/home";
import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/NavBar';
import Proyectos from './pages/proyectos';

function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">

    <NavBar />

      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuevoProyecto" element={<NuevoProyecto/>} />
          <Route path="/proyectos" element={<Proyectos />} />
          <Route path="/contact" element={<h1>Ñañañaña</h1>} />
        </Routes>
      </div>

      
    </div>
  );
}

export default App
