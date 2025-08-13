import { Routes, Route, Link } from 'react-router-dom'
import Home from "./pages/home";
import NuevaCotizacion from "./pages/nuevaCotizacion";

function App() {

  return (
    <>      

      <div>
          {/* Aquí definimos las rutas */}
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/nuevaCotizacion" element={<NuevaCotizacion/>} />
            <Route path="/contact" element={<h1>Ñañañaña</h1>} />
          </Routes>
      </div>
      
    </>
  )
}

export default App
