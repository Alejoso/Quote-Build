from rest_framework import viewsets
from quoteAndBuildApp.models import Material, Project ,SupplierMaterial ,Phase , Quotes
from quoteAndBuildApp.api.serializers import MaterialListSerializer, ProjectSerializer , ProjectDeepSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Prefetch

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