import React, { useEffect, useState } from "react"
import { createMaterial , createSupplierMaterial  , fecthAllSuppliers} from "../api/calls"
import type { Supplier } from "../types/interfaces"
import toast , {Toaster} from "react-hot-toast"
function AddMaterial() {

    const [suppliers , SetSuppliers] = useState<Supplier[]>([]); 
    const [nitSupplierSelected , setnitSupplierSelected] = useState("");

    const [formData , SetFormData] = useState({
        name: "",
        description: "",
        category: "",
        actual_price: "",
        unit_of_measure: "", 
    })

    useEffect(() => {
        async function getSuppliers() {
            try {
                const {data} = await fecthAllSuppliers();
                SetSuppliers(data); 
            } catch (err : any) {
                console.log(err)
                toast.error(err || "Hubo un error cargando los provedores disponibles")
            }
        }

        getSuppliers(); 
    } , [])

    function handleSubmit( e: React.FormEvent<HTMLFormElement>){
        e.preventDefault(); 

        async function AddMaterialToDabaBase(){
            try {     

                const materialToAdd = {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                }

                const {data} = await createMaterial(materialToAdd);

                
                const payload = {
                    supplier: nitSupplierSelected,
                    material: data.id,
                    actual_price: Number(formData.actual_price),
                    unit_of_measure: formData.unit_of_measure,
                }

                if(payload.supplier && payload.material !== 0){
                    await createSupplierMaterial(payload)
                    toast.success("El material se creo con exito")
                }

            } catch (err:any){
                console.log(err);
                toast.error(err || "Hubo un error creando el nuevo material")
            }
        }
        
        if(nitSupplierSelected === "" || formData.name === "" || formData.category === "" || formData.actual_price === "" || Number(formData.actual_price) === 0 || formData.unit_of_measure === "") {
            toast.error("Debes de llenar todos los campos")
        } else {
            AddMaterialToDabaBase();  

            SetFormData({
                name: "",
                description: "",
                category: "",
                unit_of_measure: "",
                actual_price: "",
            })
            setnitSupplierSelected("");  
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const {name , value} = e.target;

        SetFormData((prev) => ({
        ...prev , [name]: value,
        })); 
    
    };

    return (
        <div>
            <Toaster/>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4 mt-4"
                >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-700">
                    Crear nuevo material
                    </h2>
                    <button
                    type="button"
                    onClick={() => window.history.back()} // o router.back() si usas Next.js
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors"
                    >
                    Volver
                    </button>
                </div>

                {/* Proveedor */}
                <div>
                    <label
                    htmlFor="proveedor"
                    className="block text-sm font-medium text-gray-600 mb-1"
                    >
                    Proveedor del nuevo material
                    </label>
                    <select
                    id="proveedor"
                    value={nitSupplierSelected}
                    onChange={(e) => setnitSupplierSelected(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                    <option value="">-- Selecciona un proveedor --</option>
                    {suppliers.map((prov) => (
                        <option key={prov.nit} value={prov.nit}>
                        {prov.name} - {prov.location}
                        </option>
                    ))}
                    </select>
                </div>

                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nombre del material
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                    Descripción (opcional)
                    </label>
                    <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Categoría */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                    Categoría
                    </label>
                    <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                    Precio
                    </label>
                    <input
                    type="number"
                    value={formData.actual_price}
                    name="actual_price"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Unidad de medida */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                    Unidad de medida
                    </label>
                    <input
                    type="text"
                    value={formData.unit_of_measure}
                    name="unit_of_measure"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                {/* Botón */}
                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                    Guardar
                </button>
            </form>
        </div>
    )
}

export default AddMaterial