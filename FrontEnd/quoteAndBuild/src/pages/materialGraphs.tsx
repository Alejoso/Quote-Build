import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast , { Toaster } from 'react-hot-toast';
import DisplayMaterialTable from '../components/Material/MaterialPrueba';
import type { SupplierMaterial, QuoteItemPayload } from '../types/interfaces';
import { createQuoteItem, fetchQuoteItems , fetchAllSupplierMaterials , deleteQuoteItem} from '../api/calls';
import { Bar } from 'react-chartjs-2';

// Extender la interfaz para incluir cantidad
interface MaterialWithQuantity extends SupplierMaterial {
  quantity: number;
}

const MaterialGrahps: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation() as { 
        state?: { 
            quoteId?: number; 
            phaseId?: number; 
            projectId?: number 
        } 
    };

    function transformQuoteItems(
        items: QuoteItemPayload[],
        supplierMaterials: SupplierMaterial[]
      ): MaterialWithQuantity[] {
        return items
          .map(item => {
            const supplierMaterial = supplierMaterials.find(sm => sm.id === item.supplierMaterial);
            if (!supplierMaterial) {
              return null; // lo marcamos como null temporalmente
            }
            return {
              ...supplierMaterial,
              quantity: item.quantity,
            };
          })
          .filter((m): m is MaterialWithQuantity => m !== null); // quitamos los nulos
      }

      function transformQuoteItemsToSupplierMaterial(
        items: QuoteItemPayload[],
        supplierMaterials: SupplierMaterial[]
      ): SupplierMaterial[] {
        return items
          .map(item => {
            const supplierMaterial = supplierMaterials.find(sm => sm.id === item.supplierMaterial);
            if (!supplierMaterial) {
              return null; // lo marcamos como null temporalmente
            }
            return {
              ...supplierMaterial,
            };
          })
          .filter((m): m is MaterialWithQuantity => m !== null); // quitamos los nulos
      }
      
    
    const quoteId = location?.state?.quoteId ?? -1;
    const phaseId = location?.state?.phaseId ?? -1;
    const projectId = location?.state?.projectId ?? -1;
    
    const [materials , SetMaterials] = useState<QuoteItemPayload[]>([]); 
    const [materialsWithQuantities, setMaterialsWithQuantities] = useState<MaterialWithQuantity[]>([]);
    const [materialsInSupplierMaterialStructure , setMaterialsInStrcuture] = useState<SupplierMaterial[]>([]); 
    const [supplierMaterials , setMaterials] = useState<SupplierMaterial[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    //Get supplier materials
    useEffect(() => {
        const getMaterials = async () => {
            try {
                const { data } = await fetchAllSupplierMaterials();
                setMaterials(data);
            } catch (err) {
                console.error(err);
                toast.error("No se pudo cargar los materiales.");
            } finally {
                setLoading(false);
            }
        }

        getMaterials(); 
    }, [quoteId]);

    //Get materials loaded
    useEffect(() => {
        if(quoteId === -1)
            return

        const getMaterials = async() => {
            try {
                const {data} = await fetchQuoteItems(quoteId); 
                SetMaterials(data);
                const materialsLoaded = transformQuoteItems(data, supplierMaterials);
                const supplierMaterialsIn = transformQuoteItemsToSupplierMaterial(data, supplierMaterials)
                setMaterialsWithQuantities(materialsLoaded); 
                setMaterialsInStrcuture(supplierMaterialsIn)
            } catch (error:any){
                console.log(error)
                toast.error(error ||"No se pudo cargar los materiales")
            }
        }


        getMaterials(); 
        
    } , [quoteId, supplierMaterials]);

    const handleSelectionChange = (materials: SupplierMaterial[]) => {
        // Inicializar cada material con cantidad 1
        const materialsWithQty: MaterialWithQuantity[] = materials.map(material => ({
            ...material,
            quantity: 1
        }));
        setMaterialsWithQuantities(materialsWithQty);
    };

    const handleQuantityChange = (materialId: number, newQuantity: number) => {
        if (newQuantity < 1) return; // No permitir cantidades menores a 1
        
        setMaterialsWithQuantities(prev => 
            prev.map(material => 
                material.id === materialId 
                    ? { ...material, quantity: newQuantity } 
                    : material
            )
        );
    };

    const handleMaterialGrahps = async () => {
        if (materialsWithQuantities.length === 0) {
          toast.error('Debe seleccionar al menos un material para la cotización');
          return;
        }
      
        setIsSaving(true);
        try {
          // 1️⃣ Borrar todos los registros antiguos
          if (materials.length > 0) {
            await Promise.all(
              materials
                .filter(item => item.id !== undefined) // por seguridad
                .map(item => deleteQuoteItem(item.id!))
            );
          }
      
          // 2️⃣ Crear los nuevos registros
          const quoteItemsPromises = materialsWithQuantities.map(material => {
            const itemPayload: QuoteItemPayload = {
              quote: quoteId,
              supplierMaterial: material.id,
              quantity: material.quantity,
              unit_price: material.actual_price,
              subtotal: material.actual_price * material.quantity,
            };
            return createQuoteItem(itemPayload);
          });
      
          await Promise.all(quoteItemsPromises);
      
          toast.success('Cotización guardada exitosamente!');
          navigate('/saveProject/quotes', { 
            state: { phaseId, projectId } 
          });
        } catch (error: any) {
          console.error('Error al guardar la cotización:', error);
          toast.error('Error al guardar la cotización');
        } finally {
          setIsSaving(false);
        }
      };

    const goBack = () => {
        navigate('/');
    };

    const total = materialsWithQuantities.reduce(
        (sum, material) => sum + (material.actual_price * material.quantity), 
        0
    );

    const [allMaterials, setAllMaterials] = useState<SupplierMaterial[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<SupplierMaterial[]>([]);
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

        getMaterials();
    }, []);


    if (loading) return <p>Cargando materiales...</p>;


    if (loading) {
        return <div className="p-4">Cargando cotización...</div>;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <Toaster/>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Materiales displonibles</h1>
                <button
                    onClick={goBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Volver al inicio
                </button>
            </div>



            <div>
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

            {/* Mini Bar Chart - only show when there's a name filter applied */}
            {nameFilter.trim() && filteredMaterials.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Precios por Proveedor</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <Bar
                            data={{
                                labels: filteredMaterials.map(m => m.supplier_name || 'Sin nombre'),
                                datasets: [
                                    {
                                        label: 'Precio Unitario ($)',
                                        data: filteredMaterials.map(m => m.actual_price),
                                        backgroundColor: filteredMaterials.map((_, index) => {
                                            const softColors = [
                                                'rgba(99, 102, 241, 0.6)',   // Soft indigo
                                                'rgba(236, 72, 153, 0.6)',   // Soft pink
                                                'rgba(34, 197, 94, 0.6)',    // Soft green
                                                'rgba(251, 146, 60, 0.6)',   // Soft orange
                                                'rgba(168, 85, 247, 0.6)',   // Soft purple
                                                'rgba(14, 165, 233, 0.6)',   // Soft sky blue
                                                'rgba(245, 101, 101, 0.6)',  // Soft red
                                                'rgba(52, 211, 153, 0.6)',   // Soft emerald
                                                'rgba(251, 191, 36, 0.6)',   // Soft amber
                                                'rgba(139, 92, 246, 0.6)',   // Soft violet
                                            ];
                                            return softColors[index % softColors.length];
                                        }),
                                        borderColor: filteredMaterials.map((_, index) => {
                                            const borderColors = [
                                                'rgba(99, 102, 241, 1)',     // Indigo
                                                'rgba(236, 72, 153, 1)',     // Pink
                                                'rgba(34, 197, 94, 1)',      // Green
                                                'rgba(251, 146, 60, 1)',     // Orange
                                                'rgba(168, 85, 247, 1)',     // Purple
                                                'rgba(14, 165, 233, 1)',     // Sky blue
                                                'rgba(245, 101, 101, 1)',    // Red
                                                'rgba(52, 211, 153, 1)',     // Emerald
                                                'rgba(251, 191, 36, 1)',     // Amber
                                                'rgba(139, 92, 246, 1)',     // Violet
                                            ];
                                            return borderColors[index % borderColors.length];
                                        }),
                                        borderWidth: 1,
                                    },
                                ],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top' as const,
                                    },
                                    title: {
                                        display: true,
                                        text: `Comparación de Precios - ${nameFilter}`,
                                    },
                                    tooltip: {
                                        callbacks: {
                                            afterLabel: (context) => {
                                                const material = filteredMaterials[context.dataIndex];
                                                return [
                                                    `Material: ${material.material_name}`,
                                                    `Categoría: ${material.material_category}`,
                                                    `Unidad: ${material.unit_of_measure}`
                                                ];
                                            },
                                        },
                                    },
                                },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Precio Unitario ($)'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Proveedor'
                                        }
                                    }
                                },
                            }}
                        />
                    </div>
                </div>
            )}

            <p className="mb-2 text-xs text-gray-500">
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

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>            
            
            
            
        </div>
    );
};

export default MaterialGrahps;