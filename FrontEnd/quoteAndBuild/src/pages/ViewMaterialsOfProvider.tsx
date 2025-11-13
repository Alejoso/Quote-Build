import React, { useEffect, useState } from 'react';
import {useLocation ,  useNavigate } from 'react-router-dom';
import toast , { Toaster } from 'react-hot-toast';
import { fetchMaterialsFromSpecificProvider } from '../api/calls';
import type { Material } from '../types/interfaces';


const ViewMAterialsOfProvider: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation() as { 
        state?: { 
            supplierNit: number
            supplierName: string
        } 
    };
    
    const supplierNit = location?.state?.supplierNit ?? -1;
    const supplierName = location?.state?.supplierName ?? -1;

    const [materials , setMaterials] = useState<Material[]>(); 
    const [loading , setLoading] = useState<boolean>(); 

    //Get the materials of the specific provider
    useEffect(() => {
        const getMaterials = async () => {
            try {
                const { data } = await fetchMaterialsFromSpecificProvider(String(supplierNit));
                setMaterials(data);
                console.log(data)
            } catch (err) {
                console.error(err);
                toast.error("No se pudo cargar los materiales.");
            } finally {
                setLoading(false);
            }
        };

        getMaterials();
    }, []);

    if (loading) {
        return <p className="text-center text-gray-600">Cargando...</p>;
    }

    return (
        <div>
            <Toaster/>

        <center>
            <h1 className="text-xl font-bold text-gray-700 mb-4 mt-5">Materiales distribuidos por {supplierName}</h1>
        </center>

        <div className="overflow-x-auto p-4">

            <table className="min-w-full border border-gray-200 bg-white shadow-md rounded-lg">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border-b text-left text-gray-600">ID</th>
                    <th className="px-4 py-2 border-b text-left text-gray-600">Nombre</th>
                    <th className="px-4 py-2 border-b text-left text-gray-600">Categoría</th>
                    <th className="px-4 py-2 border-b text-left text-gray-600">Descripción</th>
                </tr>
                </thead>
                <tbody>
                {materials?.map((material) => (
                    <tr key={material.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{material.id}</td>
                    <td className="px-4 py-2 border-b">{material.name}</td>
                    <td className="px-4 py-2 border-b">{material.category}</td>
                    <td className="px-4 py-2 border-b">{material.description || "N/A"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>

    </div>
    );
}; 

export default ViewMAterialsOfProvider; 