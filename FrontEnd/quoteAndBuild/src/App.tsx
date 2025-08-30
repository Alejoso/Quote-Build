import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home";
import SaveProject from './pages/SaveProject';
import FetchProjects from "./pages/FetchProjects";
//import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/shared/NavBar';
//import ProjectView from './pages/proyectos';


function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">

      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/newProject' element={<SaveProject />} />
        <Route path="/projects" element={<FetchProjects />} />
      </Routes>


    </div>
  );
};

export default App;
