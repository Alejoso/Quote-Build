from rest_framework import viewsets
from quoteAndBuildApp.models import Material
from quoteAndBuildApp.api.serializers import MaterialSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer