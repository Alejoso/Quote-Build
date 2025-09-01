import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home";
import SaveProject from './pages/SaveProject';
import FetchProjects from "./pages/FetchProjects";
//import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/shared/NavBar';
//import ProjectView from './pages/proyectos';
import Quotes from './pages/Quotes';
import SaveQuote from './pages/SaveQuote';


function App() {

  return (
    <div className="w-screen h-screen overflow-x-hidden overflow-y-auto">

      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/saveProject' element={<SaveProject />} />
        <Route path="/projects" element={<FetchProjects />} />
        <Route path="/saveProject/quotes" element={<Quotes />} />
        <Route path="/saveProject/quotes/saveQuote" element={<SaveQuote />} />

      </Routes>


    </div>
  );
};

export default App;