import toast, { Toaster } from "react-hot-toast";
import React, { useState } from "react";
import { createSupplier, createSupplierPhone } from "../api/calls";

function AddSupplier() {
    const [formData, setFormData] = useState({
        nit: "",
        name: "",
        location: "",
        type: "",
        bank_account: "",
        phones: [""]
    });
    const [loading, setLoading] = useState(false);

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
            await createSupplier(formData);
            // Crear los teléfonos asociados
            await Promise.all(
                formData.phones.map(phone =>
                    createSupplierPhone({ supplier: formData.nit, phone })
                )
            );
            toast.success("Proveedor creado correctamente");

            // Resetear formulario
            setFormData({
                nit: "",
                name: "",
                location: "",
                type: "",
                bank_account: "",
                phones: [""]
            });
        } catch (err: any) {
            if (err?.response?.status === 400 && err?.response?.data?.nit) {
                toast.error("El NIT ya está en uso. Por favor ingresa uno diferente.");
            } else {
                toast.error(err?.message || "Error al crear el proveedor");
            }
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
                    <h2 className="text-xl font-bold text-gray-700">Crear nuevo proveedor</h2>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-lg transition-colors"
                    >
                        Volver
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">NIT *</label>
                    <input
                        type="text"
                        name="nit"
                        value={formData.nit}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Nombre *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ubicación *</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tipo *</label>
                    <input
                        type="text"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Cuenta bancaria *</label>
                    <input
                        type="text"
                        name="bank_account"
                        value={formData.bank_account}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Teléfono *</label>
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
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    disabled={loading}
                >
                    {loading ? "Creando..." : "Crear proveedor"}
                </button>
            </form>
        </div>
    );
}

export default AddSupplier;
