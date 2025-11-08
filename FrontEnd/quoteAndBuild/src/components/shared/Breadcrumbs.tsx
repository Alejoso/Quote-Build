import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

interface BreadcrumbItem {
    label: string;
    path: string;
    isClickable?: boolean; // Indica si el breadcrumb es clicable
}

const Breadcrumbs = () => {
    const location = useLocation();

    const routeNames: Record<string, string> = {
        "/": "Inicio",
        "/saveProject": "Proyecto",
        "/saveProject/quotes": "Cotizaciones",
        "/saveProject/quotes/saveQuote": "Materiales",
        "/projects": "Proyectos",
        "/projects/ProjectGraph": "Gráfica del Proyecto",
        "/NewRegistry": "Base de Datos",
        "/NewRegistry/AddMaterial": "Añadir Material",
        "/NewRegistry/materials": "Ver Materiales",
        "/NewRegistry/AddSupplier": "Añadir Proveedor",
        "/NewRegistry/ViewSuppliers": "Ver Proveedores",
        "/NewRegistry/ViewSuppliers/ViewMaterialsOfProvider": "Ver Materiales de Proveedor",
        "edit": "Editar",
        "MaterialGraphs": "Gráficas de Materiales",

    };

    const breadcrumbs = useMemo(() => {
        const paths = location.pathname.split("/").filter(Boolean);
        const items: BreadcrumbItem[] = [{ label: "Inicio", path: "/" }];

        let currentPath = "";
        paths.forEach((path) => {
            currentPath += `/${path}`;

            // Detectar si es un parámetro dinámico (ej: NIT, ID)
            const isDynamicParam = !isNaN(Number(path)) || path.match(/^[0-9-]+$/);

            // Si es un parámetro dinámico, usar el valor directamente como label
            // Si no, buscar en routeNames o usar el path
            let label: string;
            if (isDynamicParam) {
                label = path; // Mostrar el NIT o ID tal cual
            } else {
                label = routeNames[currentPath] || routeNames[path] || path;
            }

            // Los parámetros dinámicos no son clicables
            items.push({ label, path: currentPath, isClickable: !isDynamicParam });
        });

        return items;
    }, [location.pathname]);

    if (breadcrumbs.length <= 1) return null;

    return (
        <nav className="w-full flex items-center bg-gray-50 px-6 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.path} className="flex items-center">
                        {index > 0 && (
                            <i className="bi bi-chevron-right text-xs text-gray-400 mx-2"></i>
                        )}
                        {index === breadcrumbs.length - 1 ? (
                            <span className="font-semibold text-gray-800">{crumb.label}</span>
                        ) : crumb.isClickable ? (
                            <Link
                                to={crumb.path}
                                className="text-gray-600 hover:text-[#ffb354] transition-colors"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="text-gray-600">{crumb.label}</span>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
};

export default Breadcrumbs;