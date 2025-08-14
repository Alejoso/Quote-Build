import { Routes, Route, Link } from "react-router-dom";
import MaterialList from "./components/materialList";
import AppStyles from "./App.module.css";
import PhaseTable from "./components/PhaseTable/phaseTable";

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
    <div className={AppStyles.AppContainer}>
      <nav className="app-nav">
        <Link to="/">Inicio</Link> | 
        <Link to="/materiales">Materiales</Link> | 
        <Link to="/project">Proyectos</Link> | 
        <Link to="/phase">Fases</Link>
      </nav>

      <h1>Gloria</h1>

      <Routes>
        <Route path="/" element={null} />
        <Route path="/materiales" element={<MaterialList label="AlejitoPingo" />} />
        <Route
          path="/phase"
          element={<PhaseTable data={phasesData} onDelete={handleDelete} />}
        />
      </Routes>
    </div>
  );
}

export default App;
