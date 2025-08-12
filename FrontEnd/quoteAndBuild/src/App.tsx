import {useEffect} from "react";
import Button from "./components/materialList";
import { Routes, Route, Link } from 'react-router-dom'
import MaterialList from './components/materialList'

function App() {

  async function fetchMaterials() {
    try 
    {
      const response = await fetch('http://127.0.0.1:8000/api/material/');
      if (!response.ok)
      {
        throw new Error(`Http error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data); 
    } catch (error)
    {
      console.error('Error fetching: ' , error); 
    }
  }

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <>      

      <div>
        <nav>
          <Link to="/">Inicio</Link> | <Link to="/materiales">Materiales</Link> | <Link to="/otra">Otra Vista</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Bienvenido a la página de inicio</h1>} />
          <Route path="/materiales" element={<MaterialList label={"AlejitoPingo"} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
