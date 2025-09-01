import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { SupplierMaterial } from "../../types/interfaces";
import { fetchAllSupplierMaterials } from "../../api/calls";

interface DisplayMaterialTableProps {
    onAdd?: (material: SupplierMaterial) => void;
}

export default function DisplayMaterialTable({ onAdd }: DisplayMaterialTableProps) {
    const [materials, setMaterials] = useState<SupplierMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMaterials = async () => {
            try {
                const { data } = await fetchAllSupplierMaterials();
                setMaterials(data);
            } catch (err) {
                console.error(err);
                toast.error("No se pudo cargar el proyecto.");
            } finally {
                setLoading(false);
            }
        };
        getMaterials();
    }, []);

    if (loading) return <p>Cargando materiales...</p>;

    return (
        <table className="table-auto border-collapse border border-gray-400 w-full">
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
                    {onAdd && <th className="border px-2 py-1">Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {materials.map((m) => (
                    <tr key={m.id}>
                        <td className="border px-2 py-1">{m.id}</td>
                        <td className="border px-2 py-1">{m.material_name}</td>
                        <td className="border px-2 py-1">{m.material_category}</td>
                        <td className="border px-2 py-1">{m.material_description || "N/A"}</td>
                        <td className="border px-2 py-1">{m.supplier_name}</td>
                        <td className="border px-2 py-1">{m.supplier_location}</td>
                        <td className="border px-2 py-1">{m.actual_price}</td>
                        <td className="border px-2 py-1">{m.unit_of_measure}</td>
                        {onAdd && (
                            <td className="border px-2 py-1 text-center">
                                <button
                                    className="text-green-600 hover:text-green-800"
                                    onClick={() => onAdd(m)}
                                >
                                    <i className="bi bi-plus-square-fill"></i>
                                </button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
