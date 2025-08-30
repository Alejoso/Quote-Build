from rest_framework import viewsets , serializers

from quoteAndBuildApp.models import Material , Project, Phase, Client
#from django.core import serializers as sr 

# Material
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class MaterialViewSet (viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    

# Project
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

#Clients
class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

# Phase
class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = '__all__'
        
class PhaseViewSet(viewsets.ModelViewSet):
    serializer_class = PhaseSerializer

    def get_queryset(self):
        qs = Phase.objects.all()  # ← FIX: use Phase
        # Optional filter to list phases for a specific project: /phases/?project=1
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs
