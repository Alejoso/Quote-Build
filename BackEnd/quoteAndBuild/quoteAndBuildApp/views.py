from rest_framework import viewsets
from quoteAndBuildApp.models import SupplierMaterial
from quoteAndBuildApp.api.serializers import MaterialSerializer

class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SupplierMaterial.objects.select_related('material_id', 'nit')
    serializer_class = MaterialSerializer

from django.http import JsonResponse
from .models import Material, SupplierMaterial


