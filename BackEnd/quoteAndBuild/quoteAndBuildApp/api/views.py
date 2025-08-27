from rest_framework import viewsets
from quoteAndBuildApp.models import Material, Project ,SupplierMaterial ,Phase , Quotes
from quoteAndBuildApp.api.serializers import MaterialListSerializer, ProjectSerializer , ProjectDeepSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Prefetch
from django.http import JsonResponse


from .serializers import MaterialListSerializer

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SupplierMaterial.objects.select_related('material_id', 'nit').order_by('material_id__name')
    serializer_class = MaterialListSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('project_id')
    # el serializer por defecto puedes dejarlo para list/create si quieres
    serializer_class = ProjectSerializer

    @action(detail=True, methods=['get'], url_path='full')
    def full(self, request, pk=None):
        project = self.get_object()
        serializer = ProjectDeepSerializer()
        return Response(serializer.to_representation(project))
    
def materials_list(request):
    # Obtener todos los materiales
    materiales = Material.objects.all()

    materiales_data = []
    for material in materiales:
        # Obtener proveedores relacionados con este material
        proveedores = SupplierMaterial.objects.filter(material_id=material.material_id)
        
        proveedores_data = []
        for sp in proveedores:
            proveedores_data.append({
                "supplier_material_id": sp.supplier_material_id,
                "actual_price": float(sp.actual_price),
                "unit_of_measure": sp.unit_of_measure,
                "supplier": {
                    "nit": sp.nit.nit,
                    "name": sp.nit.name,
                    "location": sp.nit.location,
                }
            })
        
        materiales_data.append({
            "materialId": material.material_id,
            "name": material.name,
            "category": material.category,
            "description": material.description,
            "suppliers": proveedores_data,
        })

    return JsonResponse(materiales_data, safe=False)