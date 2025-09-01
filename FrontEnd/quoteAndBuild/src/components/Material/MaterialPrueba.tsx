import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { SupplierMaterial } from "../../types/interfaces";
import { fetchAllSupplierMaterials } from "../../api/calls";
import QuoteTable from "../Quote/QuoteTable"; // Asegúrate de tener la ruta correcta

interface DisplayMaterialTableProps {
    onSelectionChange?: (selectedMaterials: SupplierMaterial[]) => void;
}

export default function DisplayMaterialTable({ onSelectionChange }: DisplayMaterialTableProps) {
    const [allMaterials, setAllMaterials] = useState<SupplierMaterial[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<SupplierMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMaterials = async () => {
            try {
                const { data } = await fetchAllSupplierMaterials();
                setAllMaterials(data);
            } catch (err) {
                console.error(err);
                toast.error("No se pudo cargar los materiales.");
            } finally {
                setLoading(false);
            }
        };
        getMaterials();
    }, []);

    const handleAddMaterial = (material: SupplierMaterial) => {
        // Verificar si el material ya está seleccionado
        if (!selectedMaterials.some(m => m.id === material.id)) {
            const updatedSelection = [...selectedMaterials, material];
            setSelectedMaterials(updatedSelection);
            
            // Notificar al componente padre sobre el cambio en la selección
            if (onSelectionChange) {
                onSelectionChange(updatedSelection);
            }
        } else {
            toast.error("Este material ya está en la cotización");
        }
    };

    const handleRemoveMaterial = (materialId: number) => {
        const updatedSelection = selectedMaterials.filter(m => m.id !== materialId);
        setSelectedMaterials(updatedSelection);
        
        // Notificar al componente padre sobre el cambio en la selección
        if (onSelectionChange) {
            onSelectionChange(updatedSelection);
        }
    };

    if (loading) return <p>Cargando materiales...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Materiales Disponibles</h2>
            <table className="table-auto border-collapse border border-gray-400 w-full mb-8">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-2 py-1">Id</th>
                        <th className="border px-2 py-1">Nombre</th>
                        <th className="border px-2 py-1">Categoría</th>
                        <th className="border px-2 py-1">Descripción</th>
                        <th className="border px-2 py-1">Proveedor</th>
                        <th className="border px-2 py-1">Ubicación</th>
                        <th className="border px-2 py-1">Precio Unitario</th>
                        <th className="border px-2 py-1">Unidad de Medida</th>
                        <th className="border px-2 py-1">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {allMaterials.map((m) => (
                        <tr key={m.id}>
                            <td className="border px-2 py-1">{m.id}</td>
                            <td className="border px-2 py-1">{m.material_name}</td>
                            <td className="border px-2 py-1">{m.material_category}</td>
                            <td className="border px-2 py-1">{m.material_description || "N/A"}</td>
                            <td className="border px-2 py-1">{m.supplier_name}</td>
                            <td className="border px-2 py-1">{m.supplier_location}</td>
                            <td className="border px-2 py-1">${m.actual_price}</td>
                            <td className="border px-2 py-1">{m.unit_of_measure}</td>
                            <td className="border px-2 py-1 text-center">
                                <button
                                    className="text-green-600 hover:text-green-800 font-bold py-1 px-2 rounded"
                                    onClick={() => handleAddMaterial(m)}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mb-4">Materiales en Cotización</h2>
            <QuoteTable 
                materials={selectedMaterials} 
                onRemove={handleRemoveMaterial} 
            />
        </div>
    );
}