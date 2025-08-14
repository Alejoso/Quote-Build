from rest_framework import viewsets
from quoteAndBuildApp.models import Material, Project
from quoteAndBuildApp.api.serializers import MaterialSerializer, ProjectSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer