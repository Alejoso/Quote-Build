import { useNavigate } from "react-router-dom"

function NewRegistry()
{
    const navigate = useNavigate(); 

    return (
        <div>
             <div className="w-screen flex flex-col items-center justify-start pt-10 pb-20 bg-gray-100 space-y-6 px-4">
                {/* Contenedor del título + imagen */}
                <div className="flex items-center mb-12 space-x-4">
                    <h1 className="text-6xl font-bold text-gray-800">Gestion de la base de datos 🗃️</h1>
                </div>


                {/*Botones*/}
                <div className="flex flex-col space-y-6">
                    <button
                    onClick={() => navigate("/AddMaterial")}
                    className="px-8 py-4 bg-naranja text-white text-xl font-semibold rounded-lg hover:bg-naranjaHover transition transform hover:scale-105 hover:rotate-3  shadow-md"
                    >
                    Añadir material
                    </button>
                    <button 
                    onClick={() => navigate("/materials")}
                    className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-lg hover:bg-greenHover transition transform hover:scale-105 hover:rotate-3  shadow-md"
                    >
                    Ver materiales
                    </button>
                    <button
                    onClick={() => navigate("/AddSupplier")}
                    className="px-8 py-4 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105 hover:rotate-3"
                    >
                    Añadir Proveedor
                    </button>
                    <button
                    onClick={() => navigate("/ViewSuppliers")}
                    className="px-8 py-4 bg-indigo-600 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105 hover:rotate-3"
                    >
                    Ver Proveedores
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewRegistry