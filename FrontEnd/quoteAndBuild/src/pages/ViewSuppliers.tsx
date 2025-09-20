import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { fecthAllSuppliers } from "../api/calls";
import type { Supplier } from "../types/interfaces";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { nav } from "framer-motion/client";

function ViewSuppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [phonesBySupplier, setPhonesBySupplier] = useState<Record<string, string[]>>({});
    const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
    const navigate = useNavigate();

    const fetchSuppliers = async () => {
        try {
            const { data } = await fecthAllSuppliers();
            setSuppliers(data);

            // Cargar teléfonos de cada proveedor
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
        } catch {
            toast.error("Error al cargar proveedores");
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-6">
            <Toaster />
            <center>
                <h1 className="text-xl font-bold text-gray-700 mb-4">Proveedores Registrados</h1>
            </center>
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
                                {(phonesBySupplier[s.nit] || []).length === 0 ? (
                                    <span className="text-gray-400">Sin teléfonos</span>
                                ) : (
                                    phonesBySupplier[s.nit].map((phone, idx) => (
                                        <div key={idx}>{phone}</div>
                                    ))
                                )}
                            </td>
                            <td className="p-2">
                                <button
                                    onClick={() => navigate(`/ViewSuppliers/${s.nit}/edit`)}
                                    className="rounded-full p-2 hover:bg-gray-100 ml-4 text-verde"
                                    aria-label="Editar proveedor"
                                >
                                    <i className="bi bi-pencil text-xl"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ViewSuppliers;