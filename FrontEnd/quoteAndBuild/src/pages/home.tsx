import { useNavigate } from "react-router-dom";
import CascoLogo from "../assets/CascpoLogo.png";

export default function Home() {
  const navigate = useNavigate();

  async function fetchMaterials() {
    try {
      const response = await fetch('http://127.0.0.1:8000/materials/'); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json(); // Or .text() for plain text
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  fetchMaterials();

  return (
    <div className="w-screen flex flex-col items-center justify-start pt-10 pb-20 bg-gray-100 space-y-6 px-4">
      {/* Contenedor del título + imagen */}
      <div className="flex items-center mb-12 space-x-4">
        <h1 className="text-6xl font-bold text-gray-800">Quote&amp;Build</h1>
        <img src={CascoLogo} alt="Logo" className="w-16 h-16" />
      </div>

      {/*Botones*/}
      <div className="flex flex-col space-y-6">
        <button
          onClick={() => navigate("/nuevoProyecto")}
          className="px-8 py-4 bg-naranja text-white text-xl font-semibold rounded-lg hover:bg-naranjaHover transition transform hover:scale-105 hover:rotate-3  shadow-md"
        >
          Nuevo proyecto
        </button>

        <button
          onClick={() => navigate("/proyectos")}
          className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-green-700 transition transform hover:scale-105 hover:rotate-3"
        >
          Proyectos
        </button>

        <button
          onClick={() => navigate("/graficos")}
          className="px-8 py-4 bg-gray-700 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-gray-800 transition transform hover:scale-105 hover:rotate-3"
        >
          Gráficos
        </button>
      </div>
    </div>
  );
}
