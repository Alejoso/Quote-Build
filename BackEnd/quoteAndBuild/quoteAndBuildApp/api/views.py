from rest_framework import viewsets
from quoteAndBuildApp.models import Material, Project ,SupplierMaterial
from quoteAndBuildApp.api.serializers import MaterialListSerializer, ProjectSerializer

from .serializers import MaterialListSerializer

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SupplierMaterial.objects.select_related('material_id', 'nit').order_by('material_id__name')
    serializer_class = MaterialListSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer