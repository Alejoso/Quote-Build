import { useEffect, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { SupplierMaterial } from "../../types/interfaces";
import { fetchAllSupplierMaterials } from "../../api/calls";
import QuoteTable from "../Quote/QuoteTable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DisplayMaterialTableProps {
  onSelectionChange?: (selectedMaterials: SupplierMaterial[]) => void;
  currentSelectedMaterials?: SupplierMaterial[];
}

export default function DisplayMaterialTable({
  onSelectionChange,
  currentSelectedMaterials,
}: DisplayMaterialTableProps) {
  const [allMaterials, setAllMaterials] = useState<SupplierMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<SupplierMaterial[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [nameFilter, setNameFilter] = useState<string>("");
  const [locationFilter, setLocationFilter] = useState<string>("");
  const [providerFilter, setProviderFilter] = useState<string>("");

  // ********** PAGINACIÓN **********
  const [page, setPage] = useState(1);
  const pageSize = 10; // 10 materiales por página
  // ********************************

  // Filtrado
  const filteredMaterials = useMemo(() => {
    const nameQuery = nameFilter.trim().toLowerCase();
    const locationQuery = locationFilter.trim().toLowerCase();
    const providerQuery = providerFilter.trim().toLowerCase();

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
    if (providerQuery) {
      filtered = filtered.filter(m =>
        (m.supplier_name ?? "").toLowerCase().includes(providerQuery)
      );
    }
    return filtered;
  }, [allMaterials, nameFilter, locationFilter, providerFilter]);

  // Ajustar página si cambian los resultados
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [filteredMaterials.length, page, pageSize]);

  // Reset a página 1 cuando cambian filtros
  useEffect(() => { setPage(1); }, [nameFilter, locationFilter, providerFilter]);

  // Slice de la página actual
  const totalPages = Math.max(1, Math.ceil(filteredMaterials.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageData = filteredMaterials.slice(start, start + pageSize);

  // Carga inicial
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

    if (currentSelectedMaterials) setSelectedMaterials(currentSelectedMaterials);
    getMaterials();
  }, [currentSelectedMaterials]);

  // Selección
  const handleAddMaterial = (material: SupplierMaterial) => {
    if (selectedMaterials && !selectedMaterials.some(m => m.id === material.id)) {
      const updated = [...selectedMaterials, material];
      setSelectedMaterials(updated);
      onSelectionChange?.(updated);
    } else {
      toast.error("Este material ya está en la cotización");
    }
  };

  const handleRemoveMaterial = (materialId: number) => {
    const updated = selectedMaterials.filter(m => m.id !== materialId);
    setSelectedMaterials(updated);
    onSelectionChange?.(updated);
  };

  const go = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  if (loading) return <p>Cargando materiales...</p>;

  return (
    <div>
      <Toaster />
      <h2 className="text-xl font-bold mb-4">Materiales Disponibles</h2>

      {/* Filtros */}
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
        <input
          type="text"
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value)}
          placeholder="Filtrar por proveedor..."
          className="block w-full rounded-xl border border-gray-300 px-3 py-2"
          style={{ maxWidth: "300px" }}
        />
      </div>

      {/* Mini Bar Chart (sigue usando todos los filtrados, no solo la página actual) */}
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
                    backgroundColor: filteredMaterials.map((_, i) => {
                      const colors = [
                        'rgba(99, 102, 241, 0.6)', 'rgba(236, 72, 153, 0.6)',
                        'rgba(34, 197, 94, 0.6)',  'rgba(251, 146, 60, 0.6)',
                        'rgba(168, 85, 247, 0.6)', 'rgba(14, 165, 233, 0.6)',
                        'rgba(245, 101, 101, 0.6)','rgba(52, 211, 153, 0.6)',
                        'rgba(251, 191, 36, 0.6)', 'rgba(139, 92, 246, 0.6)',
                      ];
                      return colors[i % colors.length];
                    }),
                    borderColor: filteredMaterials.map((_, i) => {
                      const borders = [
                        'rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)',
                        'rgba(34, 197, 94, 1)',  'rgba(251, 146, 60, 1)',
                        'rgba(168, 85, 247, 1)', 'rgba(14, 165, 233, 1)',
                        'rgba(245, 101, 101, 1)','rgba(52, 211, 153, 1)',
                        'rgba(251, 191, 36, 1)', 'rgba(139, 92, 246, 1)',
                      ];
                      return borders[i % borders.length];
                    }),
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' as const },
                  title: { display: true, text: `Comparación de Precios - ${nameFilter}` },
                  tooltip: {
                    callbacks: {
                      afterLabel: (context) => {
                        const material = filteredMaterials[context.dataIndex];
                        return [
                          `Material: ${material.material_name}`,
                          `Categoría: ${material.material_category}`,
                          `Unidad: ${material.unit_of_measure}`,
                        ];
                      },
                    },
                  },
                },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Precio Unitario ($)' } },
                  x: { title: { display: true, text: 'Proveedor' } },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Resumen + Paginación: contador */}
      <div className="mb-2 text-xs text-gray-500">
        {filteredMaterials.length} material{filteredMaterials.length === 1 ? "" : "es"} ·{" "}
        {filteredMaterials.length > 0
          ? <>Mostrando {start + 1}–{Math.min(start + pageSize, filteredMaterials.length)} de {filteredMaterials.length}</>
          : "Sin resultados"}
      </div>

      {/* Tabla paginada */}
      <table className="table-auto border-collapse border border-gray-400 w-full mb-4">
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
          {pageData.map((m) => (
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
          {pageData.length === 0 && (
            <tr>
              <td className="border px-2 py-6 text-center text-gray-500" colSpan={9}>
                No hay materiales
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Controles de paginación */}
      <div className="flex items-center justify-end gap-2 mb-8">
        <button className="px-3 py-1 rounded border" onClick={() => go(1)} disabled={page === 1}>«</button>
        <button className="px-3 py-1 rounded border" onClick={() => go(page - 1)} disabled={page === 1}>Anterior</button>
        <span className="px-2 text-sm">Página {page} / {totalPages}</span>
        <button className="px-3 py-1 rounded border" onClick={() => go(page + 1)} disabled={page === totalPages}>Siguiente</button>
        <button className="px-3 py-1 rounded border" onClick={() => go(totalPages)} disabled={page === totalPages}>»</button>
      </div>

      <h2 className="text-xl font-bold mb-4">Materiales en Cotización</h2>
      <QuoteTable materials={selectedMaterials} onRemove={handleRemoveMaterial} />
    </div>
  );
}
