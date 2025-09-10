

import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { createSupplier, createSupplierPhone, fecthAllSuppliers } from "../api/calls";
import axios from "axios";
import type { Supplier } from "../types/interfaces";

function AddSupplier() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [phonesBySupplier, setPhonesBySupplier] = useState<Record<string, string[]>>({});
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    // Definir fetchSuppliers fuera del useEffect para poder reutilizarla
    const fetchSuppliers = async () => {
        try {
            const { data } = await fecthAllSuppliers();
            setSuppliers(data);
            // Por cada supplier, obtener sus teléfonos
            const phonesObj: Record<string, string[]> = {};
            await Promise.all(
                data.map(async (s: Supplier) => {
                    try {
                        const resp = await axios.get(`${API_URL}/supplier-phones/?supplier=${s.nit}`);
                        phonesObj[s.nit] = resp.data.map((p: any) => p.phone);
                    } catch {
                        phonesObj[s.nit] = [];
                    }
                })
            );
            setPhonesBySupplier(phonesObj);
        } catch (err) {
            toast.error("Error al cargar proveedores");
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const [formData, setFormData] = useState({
        nit: "",
        name: "",
        location: "",
        type: "",
        bank_account: "",
        phones: [""]
    });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingNit, setEditingNit] = useState<string | null>(null);

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
            if (isEditing && editingNit) {
                // Actualizar proveedor existente
                await axios.put(`${API_URL}/suppliers/${editingNit}/`, {
                    nit: formData.nit,
                    name: formData.name,
                    location: formData.location,
                    type: formData.type,
                    bank_account: formData.bank_account
                });
                // Obtener los teléfonos actuales del proveedor
                const resp = await axios.get(`${API_URL}/supplier-phones/?supplier=${editingNit}`);
                const phoneIds = resp.data.map((p: any) => p.id);
                // Eliminar cada teléfono individualmente
                await Promise.all(
                    phoneIds.map((id: number) => axios.delete(`${API_URL}/supplier-phones/${id}/`))
                );
                // Crear los teléfonos nuevos
                await Promise.all(
                    formData.phones.map(phone =>
                        createSupplierPhone({ supplier: formData.nit, phone })
                    )
                );
                toast.success("Proveedor actualizado correctamente");
            } else {
                await createSupplier(formData);
                // Crear los teléfonos asociados
                await Promise.all(
                    formData.phones.map(phone =>
                        createSupplierPhone({ supplier: formData.nit, phone })
                    )
                );
                toast.success("Proveedor creado correctamente");
            }
            setFormData({
                nit: "",
                name: "",
                location: "",
                type: "",
                bank_account: "",
                phones: [""]
            });
            setIsEditing(false);
            setEditingNit(null);
            // Volver a cargar la lista de proveedores
            await fetchSuppliers();
        } catch (err: any) {
            if (!isEditing && err?.response?.status === 400 && err?.response?.data?.nit) {
                toast.error("El NIT ya está en uso. Por favor ingresa uno diferente.");
            } else {
                toast.error(err?.message || (isEditing ? "Error al actualizar el proveedor" : "Error al crear el proveedor"));
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleEditSupplier(nit: string) {

        // Buscar el proveedor por NIT
        const supplier = suppliers.find(s => s.nit === nit);
        if (!supplier) return;
        setFormData({
            nit: supplier.nit,
            name: supplier.name,
            location: supplier.location,
            type: supplier.type,
            bank_account: supplier.bank_account,
            phones: phonesBySupplier[supplier.nit] && phonesBySupplier[supplier.nit].length > 0
                ? [...phonesBySupplier[supplier.nit]]
                : [""]
        });
        setIsEditing(true);
        setEditingNit(supplier.nit);
    }

    function handleCancelEdit() {
        setFormData({
            nit: "",
            name: "",
            location: "",
            type: "",
            bank_account: "",
            phones: [""]
        });
        setIsEditing(false);
        setEditingNit(null);
    }

    return (
        <div className="mb-6">
            <Toaster />
            {/* Tabla de proveedores */}
            <div className="max-w-2xl mx-auto mb-8">
                <center><h1 className="text-xl font-bold text-gray-700 mt-4 mb-3">Proveedores Registrados</h1></center>
                <table className="w-full border rounded-xl bg-white shadow text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">NIT</th>
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Ubicación</th>
                            <th className="p-2">Tipo</th>
                            <th className="p-2">Cuenta bancaria</th>
                            <th className="p-2">Teléfonos</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map((s) => (
                            <tr key={s.nit} className="border-t text-center">
                                <td className="p-2">{s.nit}</td>
                                <td className="p-2">{s.name}</td>
                                <td className="p-2">{s.location}</td>
                                <td className="p-2">{s.type}</td>
                                <td className="p-2">{s.bank_account}</td>
                                <td className="p-2">
                                    {(phonesBySupplier[s.nit] || []).length === 0
                                        ? <span className="text-gray-400">Sin teléfonos</span>
                                        : phonesBySupplier[s.nit].map((phone, idx) => (
                                            <div key={idx}>{phone}</div>
                                        ))}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => { handleEditSupplier(s.nit) }}
                                        className="rounded-full p-2 hover:bg-gray-100 ml-4 text-verde"
                                        aria-label="Editar proyecto"
                                    >
                                        <i className="bi bi-pencil text-xl"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4 mt-4"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-700">{isEditing ? "Editar proveedor" : "Crear nuevo proveedor"}</h2>
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors"
                        >
                            Cancelar edición
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors"
                        >
                            Volver
                        </button>
                    )}
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
                    className={`w-full ${isEditing ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"} text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
                    disabled={loading}
                >
                    {loading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Guardar cambios" : "Crear proveedor")}
                </button>
            </form>
        </div>
    );
}

export default AddSupplier;
