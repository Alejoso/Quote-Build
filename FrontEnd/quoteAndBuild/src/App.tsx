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
        <Route path="/ProjectGraph" element={<SpecificGraph />} />
        <Route path="/NewRegistry" element={<NewRegistry />} />
        <Route path="/AddMaterial" element={<AddMaterial />} />
        <Route path="/AddSupplier" element={<AddSupplier />} />
        <Route path="/ViewSuppliers" element={<ViewSuppliers />} />
        <Route path="/ViewSuppliers/:nit/edit" element={<EditSupplier />} />
        <Route path="/materials" element={<MaterialsList />} />
        <Route path="/materials/:id/edit" element={<EditMaterial />} />
        <Route path="/ViewMaterialsOfProvider" element={<ViewMAterialsOfProvider />} />
      </Routes>


    </div>
  );
};

export default App;