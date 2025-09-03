import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DisplayMaterialTable from '../components/Material/MaterialPrueba';
import type { SupplierMaterial, QuoteItemPayload } from '../types/interfaces';
import { createQuoteItem, fetchQuoteItems, deleteQuoteItem } from '../api/calls';

// Extender la interfaz para incluir cantidad
interface MaterialWithQuantity extends SupplierMaterial {
  quantity: number;
}

const SaveQuote: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation() as { 
        state?: { 
            quoteId?: number; 
            phaseId?: number; 
            projectId?: number 
        } 
    };
    
    const quoteId = location?.state?.quoteId ?? -1;
    const phaseId = location?.state?.phaseId ?? -1;
    const projectId = location?.state?.projectId ?? -1;
    
    const [materialsWithQuantities, setMaterialsWithQuantities] = useState<MaterialWithQuantity[]>([]);
    const [existingQuoteItems, setExistingQuoteItems] = useState<QuoteItemPayload[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Cargar items existentes de la cotización
    useEffect(() => {
        if (quoteId === -1) {
            toast.error('No se proporcionó un ID de cotización válido');
            navigate('/quotes');
            return;
        }

        const loadQuoteItems = async () => {
            try {
                setLoading(true);
                const response = await fetchQuoteItems(quoteId);
                setExistingQuoteItems(response.data);
                
            } catch (error) {
                console.error('Error al cargar items de la cotización:', error);
                toast.error('Error al cargar la cotización');
            } finally {
                setLoading(false);
            }
        };

        loadQuoteItems();
    }, [quoteId, navigate]);

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

    const handleSaveQuote = async () => {
        if (materialsWithQuantities.length === 0) {
            toast.error('Debe seleccionar al menos un material para la cotización');
            return;
        }

        setIsSaving(true);
        try {
            // Crear los nuevos items de la cotización
            const quoteItemsPromises = materialsWithQuantities.map(material => {
                const itemPayload: QuoteItemPayload = {
                    quote: quoteId,
                    supplierMaterial: material.id,
                    quantity: material.quantity,
                    unit_price: material.actual_price,
                    subtotal: material.actual_price * material.quantity
                };
                return createQuoteItem(itemPayload);
            });

            await Promise.all(quoteItemsPromises);
            toast.success('Cotización guardada exitosamente!');
            
            // Redirigir de vuelta a la vista de quotes
            navigate('/saveProject/quotes', { 
                state: { 
                    phaseId: phaseId,
                    projectId: projectId 
                } 
            });

        } catch (error) {
            console.error('Error al guardar la cotización:', error);
            toast.error('Error al guardar la cotización');
        } finally {
            setIsSaving(false);
        }
    };

    const goBack = () => {
        navigate('/saveProject/quotes', { 
            state: { 
                phaseId: phaseId,
                projectId: projectId 
            } 
        });
    };

    const total = materialsWithQuantities.reduce(
        (sum, material) => sum + (material.actual_price * material.quantity), 
        0
    );

    if (loading) {
        return <div className="p-4">Cargando cotización...</div>;
    }

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Editar Cotización #{quoteId}</h1>
                <button
                    onClick={goBack}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                    Volver a Cotizaciones
                </button>
            </div>

            <p className="mb-4 text-gray-600">
                Fase ID: {phaseId} | Proyecto ID: {projectId}
            </p>

            <DisplayMaterialTable onSelectionChange={handleSelectionChange} />
            
            {/* Tabla de materiales seleccionados con cantidades */}
            {materialsWithQuantities.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Materiales en Cotización</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-2 py-1">Nombre</th>
                                    <th className="border px-2 py-1">Proveedor</th>
                                    <th className="border px-2 py-1">Precio Unitario</th>
                                    <th className="border px-2 py-1">Cantidad</th>
                                    <th className="border px-2 py-1">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materialsWithQuantities.map((material) => (
                                    <tr key={material.id} className="hover:bg-gray-50">
                                        <td className="border px-2 py-1">{material.material_name}</td>
                                        <td className="border px-2 py-1">{material.supplier_name}</td>
                                        <td className="border px-2 py-1">${material.actual_price}</td>
                                        <td className="border px-2 py-1">
                                            <input
                                                type="number"
                                                min="1"
                                                value={material.quantity}
                                                onChange={(e) => handleQuantityChange(material.id, parseInt(e.target.value) || 1)}
                                                className="w-16 p-1 border rounded text-center"
                                            />
                                        </td>
                                        <td className="border px-2 py-1">
                                            ${material.actual_price * material.quantity}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-50">
                                    <td colSpan={4} className="border px-2 py-1 text-right font-semibold">Total:</td>
                                    <td className="border px-2 py-1 font-semibold">${total}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Botón de guardar */}
            <div className="mt-6 p-4 bg-blue-50 rounded">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Resumen de Cotización</h3>
                        <p className="mb-2">Materiales seleccionados: {materialsWithQuantities.length}</p>
                        <p className="font-bold">Total: ${total}</p>
                    </div>
                    
                    <button
                        onClick={handleSaveQuote}
                        disabled={isSaving || materialsWithQuantities.length === 0}
                        className={`px-4 py-2 rounded text-white font-medium ${
                            isSaving || materialsWithQuantities.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}
                    >
                        {isSaving ? 'Guardando...' : 'Guardar Cotización'}
                    </button>
                </div>
            </div>

            {/* Mostrar items existentes en la cotización */}
            {existingQuoteItems.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Materiales existentes en esta cotización</h3>
                    <div className="bg-yellow-50 p-4 rounded">
                        <p>Esta cotización ya tiene {existingQuoteItems.length} material(es) asociado(s).</p>
                        <p className="mt-2">
                            Al guardar, se añadirán {materialsWithQuantities.length} material(es) adicional(es).
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveQuote;