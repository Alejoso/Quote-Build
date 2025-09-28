import { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { SupplierMaterial } from "../../types/interfaces";
import { fetchAllSupplierMaterials } from "../../api/calls";
import QuoteTable from "../Quote/QuoteTable"; // Asegúrate de tener la ruta correcta

interface DisplayMaterialTableProps {
    onSelectionChange?: (selectedMaterials: SupplierMaterial[]) => void;
    currentSelectedMaterials?: SupplierMaterial[];
}

export default function DisplayMaterialTable({ onSelectionChange, currentSelectedMaterials }: DisplayMaterialTableProps) {
    const [allMaterials, setAllMaterials] = useState<SupplierMaterial[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<SupplierMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [nameFilter, setNameFilter] = useState<string>("");
    const [locationFilter, setLocationFilter] = useState<string>("");

    // Filter materials based on name and location
    const filteredMaterials = useMemo(() => {
        const nameQuery = nameFilter.trim().toLowerCase();
        const locationQuery = locationFilter.trim().toLowerCase();

        let filtered = allMaterials;

        if (nameQuery) {
            filtered = filtered.filter(m =>
                (m.material_name ?? "").toLowerCase().includes(nameQuery)
            );
        }

        if (locationQuery) {
            filtered = filtered.filter(m =>
                (m.supplier_location ?? "").toLowerCase().includes(locationQuery)
            );
        }

        return filtered;
    }, [allMaterials, nameFilter, locationFilter]);

    //Mostrar todos los materiales en la tabla
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

        if (currentSelectedMaterials)
            setSelectedMaterials(currentSelectedMaterials)

        getMaterials();
    }, [currentSelectedMaterials]);

    //Añadir un material
    const handleAddMaterial = (material: SupplierMaterial) => {
        // Verificar si el material ya está seleccionado
        if (selectedMaterials && !selectedMaterials.some(m => m.id === material.id)) {
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
            <Toaster />
            <h2 className="text-xl font-bold mb-4">Materiales Disponibles</h2>

            {/* Filters */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 items-center">
                <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Filtrar por nombre del material..."
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    style={{ maxWidth: "300px" }}
                />
                <input
                    type="text"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    placeholder="Filtrar por ciudad..."
                    className="block w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    style={{ maxWidth: "300px" }}
                />
            </div>

            <p className="mb-2 text-xs text-gray-500">
                {filteredMaterials.length} material{filteredMaterials.length === 1 ? "" : "es"}
            </p>

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
                    {filteredMaterials.map((m) => (
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