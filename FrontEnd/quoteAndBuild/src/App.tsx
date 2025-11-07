import { Routes, Route } from 'react-router-dom'
import Home from "./pages/home";
import SaveProject from './pages/SaveProject';
import FetchProjects from "./pages/FetchProjects";
//import NuevoProyecto from "./pages/nuevoProyecto";
import NavBar from './components/shared/NavBar';
//import ProjectView from './pages/proyectos';
import Quotes from './pages/Quotes';
import SaveQuote from './pages/SaveQuote';
import SpecificGraph from './pages/SpecificGraph';
import NewRegistry from './pages/NewRegistry';
import AddMaterial from './pages/AddMaterial';
import AddSupplier from './pages/AddSupplier';
import MaterialsList from "./pages/MaterialsList";
import EditMaterial from "./pages/EditMaterial";
import ViewSuppliers from './pages/ViewSuppliers';
import EditSupplier from './pages/EditSupplier';
import ViewMAterialsOfProvider from './pages/ViewMaterialsOfProvider';
import MaterialGrahps from './pages/materialGraphs';

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
        <Route path="/projects/ProjectGraph" element={<SpecificGraph />} />
        <Route path="/NewRegistry" element={<NewRegistry />} />
        <Route path="/NewRegistry/AddMaterial" element={<AddMaterial />} />
        <Route path="/NewRegistry/AddSupplier" element={<AddSupplier />} />
        <Route path="/NewRegistry/ViewSuppliers" element={<ViewSuppliers />} />
        <Route path="NewRegistry/ViewSuppliers/:nit/edit" element={<EditSupplier />} />
        <Route path="/NewRegistry/materials" element={<MaterialsList />} />
        <Route path="/NewRegistry/materials/:id/edit" element={<EditMaterial />} />
        <Route path="/NewRegistry/ViewSuppliers/ViewMaterialsOfProvider" element={<ViewMAterialsOfProvider />} />
        <Route path="/MaterialGraphs" element={<MaterialGrahps />} />

      </Routes>


    </div>
  );
};

export default App;