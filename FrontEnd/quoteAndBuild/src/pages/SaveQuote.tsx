import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DisplayMaterialTable from '../components/Material/MaterialPrueba';
import type { SupplierMaterial, QuoteItemPayload } from '../types/interfaces';
import { createQuoteItem, fetchQuoteItems } from '../api/calls';

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
    
    const [selectedMaterials, setSelectedMaterials] = useState<SupplierMaterial[]>([]);
    const [existingQuoteItems, setExistingQuoteItems] = useState<QuoteItemPayload[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    // Cargar items existentes de la cotización
    useEffect(() => {
        if (quoteId === -1) {
            console.log('No se proporcionó un ID de cotización válido')
            toast.error('No se proporcionó un ID de cotización válido');
            navigate('/saveProject/quotes');
            return;
        }

        const loadQuoteItems = async () => {
            try {
                setLoading(true);
                const response = await fetchQuoteItems(quoteId);
                setExistingQuoteItems(response.data);
                // Aquí podrías mapear los items existentes a SupplierMaterial si es necesario
                // Esto depende de cómo esté estructurada la respuesta de fetchQuoteItems
                
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
        setSelectedMaterials(materials);
    };

    const handleSaveQuote = async () => {
        if (selectedMaterials.length === 0) {
            toast.error('Debe seleccionar al menos un material para la cotización');
            return;
        }

        setIsSaving(true);
        try {
            // Crear los items de la cotización (QuoteSupplierMaterial)
            const quoteItemsPromises = selectedMaterials.map(async material => {
                const itemPayload: QuoteItemPayload = {
                    quote: quoteId,
                    supplierMaterial: material.id,
                    quantity: 1, // Puedes modificar esto para permitir cantidades variables
                    unit_price: material.actual_price,
                    subtotal: material.actual_price // quantity * unit_price si quantity > 1
                };
                const res = await createQuoteItem(itemPayload);
                console.log(res);
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

    const total = selectedMaterials.reduce((sum, material) => sum + material.actual_price, 0);

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
            
            {/* Resumen de cotización y botón de guardar */}
            <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="text-lg font-semibold mb-2">Resumen de Cotización</h3>
                <p className="mb-2">Materiales seleccionados: {selectedMaterials.length}</p>
                <p className="mb-4 font-bold">Total estimado: ${total}</p>
                
                <button
                    onClick={handleSaveQuote}
                    disabled={isSaving || selectedMaterials.length === 0}
                    className={`px-4 py-2 rounded text-white font-medium ${
                        isSaving || selectedMaterials.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                    {isSaving ? 'Guardando...' : 'Guardar Materiales en Cotización'}
                </button>
            </div>

            {/* Mostrar items existentes en la cotización */}
            {existingQuoteItems.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Materiales existentes en esta cotización</h3>
                    <div className="bg-yellow-50 p-4 rounded">
                        <p>Esta cotización ya tiene {existingQuoteItems.length} material(es) asociado(s).</p>
                        <p className="mt-2">
                            Al guardar, se añadirán {selectedMaterials.length} material(es) adicional(es).
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SaveQuote;