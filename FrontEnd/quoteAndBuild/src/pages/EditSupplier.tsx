import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { createSupplierPhone } from "../api/calls";
import type { Supplier } from "../types/interfaces";

function EditSupplier() {
    const { nit } = useParams<{ nit: string }>();
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    const [formData, setFormData] = useState({
        nit: "",
        name: "",
        location: "",
        type: "",
        bank_account: "",
        phones: [""]
    });
    const [originalNit, setOriginalNit] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // 🔹 Cargar datos del proveedor al montar el componente
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                // Datos del supplier
                const supplierResp = await axios.get(`${API_URL}/suppliers/${nit}/`);
                const supplier: Supplier = supplierResp.data;

                // Teléfonos del supplier
                const phonesResp = await axios.get(`${API_URL}/supplier-phones/?supplier=${nit}`);
                const phones = phonesResp.data.map((p: any) => p.phone);

                setFormData({
                    nit: supplier.nit,
                    name: supplier.name,
                    location: supplier.location,
                    type: supplier.type,
                    bank_account: supplier.bank_account,
                    phones: phones.length > 0 ? phones : [""]
                });
                setOriginalNit(supplier.nit);
            } catch (err) {
                toast.error("Error al cargar proveedor");
                navigate("/ViewSuppliers");
            }
        };

        fetchSupplier();
    }, [nit, API_URL, navigate]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handlePhoneChange(idx: number, value: string) {
        const phones = [...formData.phones];
        phones[idx] = value;
        setFormData((prev) => ({ ...prev, phones }));
    }

    function addPhone() {
        setFormData((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
    }

    function removePhone(idx: number) {
        setFormData((prev) => ({ ...prev, phones: prev.phones.filter((_, i) => i !== idx) }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (
            !formData.nit ||
            !formData.name ||
            !formData.location ||
            !formData.type ||
            !formData.bank_account ||
            formData.phones.some((p) => !p)
        ) {
            toast.error("Debes llenar todos los campos y al menos un teléfono");
            return;
        }

        setLoading(true);
        try {
            const nitHasChanged = formData.nit !== originalNit;

            if (nitHasChanged) {
                // Si el NIT cambió, necesitamos crear un nuevo proveedor y eliminar el anterior

                // 1. Verificar que el nuevo NIT no exista ya
                try {
                    await axios.get(`${API_URL}/suppliers/${formData.nit}/`);
                    toast.error("Ya existe un proveedor con ese NIT");
                    return;
                } catch (checkErr: any) {
                    // Si da error 404, significa que no existe y podemos continuar
                    if (checkErr.response?.status !== 404) {
                        throw checkErr;
                    }
                }

                // 2. Eliminar los teléfonos del proveedor anterior PRIMERO
                const oldPhonesResp = await axios.get(`${API_URL}/supplier-phones/?supplier=${originalNit}`);
                const oldPhoneIds = oldPhonesResp.data.map((p: any) => p.id);
                await Promise.all(
                    oldPhoneIds.map((id: number) => axios.delete(`${API_URL}/supplier-phones/${id}/`))
                );

                // 3. Eliminar el proveedor anterior
                await axios.delete(`${API_URL}/suppliers/${originalNit}/`);

                // 4. Crear el nuevo proveedor
                await axios.post(`${API_URL}/suppliers/`, {
                    nit: formData.nit,
                    name: formData.name,
                    location: formData.location,
                    type: formData.type,
                    bank_account: formData.bank_account
                });

                // 5. Crear los teléfonos para el nuevo proveedor
                await Promise.all(
                    formData.phones.map(phone =>
                        createSupplierPhone({ supplier: formData.nit, phone })
                    )
                );

                toast.success("Proveedor actualizado correctamente");
            } else {
                // Si el NIT no cambió, solo actualizar normalmente
                await axios.put(`${API_URL}/suppliers/${originalNit}/`, {
                    nit: formData.nit,
                    name: formData.name,
                    location: formData.location,
                    type: formData.type,
                    bank_account: formData.bank_account
                });

                // Obtener los teléfonos actuales
                const resp = await axios.get(`${API_URL}/supplier-phones/?supplier=${originalNit}`);
                const phoneIds = resp.data.map((p: any) => p.id);

                // Eliminar teléfonos viejos
                await Promise.all(
                    phoneIds.map((id: number) => axios.delete(`${API_URL}/supplier-phones/${id}/`))
                );

                // Crear los nuevos
                await Promise.all(
                    formData.phones.map(phone =>
                        createSupplierPhone({ supplier: formData.nit, phone })
                    )
                );

                toast.success("Proveedor actualizado correctamente");
            }

            navigate("/ViewSuppliers");
        } catch (err: any) {
            toast.error(err?.response?.data?.detail || err?.message || "Error al actualizar proveedor");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mb-6">
            <Toaster />
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4 mt-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-700">Editar proveedor</h2>
                    <button
                        type="button"
                        onClick={() => navigate("/ViewSuppliers")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">NIT</label>
                    <input
                        type="text"
                        name="nit"
                        value={formData.nit}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ubicación</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cuenta bancaria</label>
                    <input
                        type="text"
                        name="bank_account"
                        value={formData.bank_account}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Teléfonos</label>
                    {formData.phones.map((phone, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={phone}
                                onChange={e => handlePhoneChange(idx, e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            {formData.phones.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removePhone(idx)}
                                    className="text-red-500 font-bold"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addPhone}
                        className="text-blue-600 font-semibold"
                    >
                        + Agregar teléfono
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    disabled={loading}
                >
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
            </form>
        </div>
    );
}

export default EditSupplier;
