from rest_framework import viewsets , serializers

from quoteAndBuildApp.models import Material , Project, Phase, Client, Supplier, SupplierMaterial, PhaseMaterial, Quote, QuoteSupplierMaterial, PhaseInterval


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
        qs = Phase.objects.all()
        # Optional filter to list phases for a specific project: /phases/?project=1
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

# --- PhaseInterval

class PhaseIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseInterval
        fields = '__all__'

class PhaseIntervalViewSet(viewsets.ModelViewSet):
    queryset = PhaseInterval.objects.all().select_related('phase')
    serializer_class = PhaseIntervalSerializer

    # opcional: filtro por fase ?phase=<id>
    def get_queryset(self):
        qs = super().get_queryset()
        phase_id = self.request.query_params.get('phase')
        if phase_id:
            qs = qs.filter(phase_id=phase_id)
        return qs


# --- Supplier
class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    lookup_field = 'nit'  # allow /suppliers/<nit>/

# --- SupplierMaterial
class SupplierMaterialSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.name', read_only=True)
    supplier_location = serializers.CharField(source='supplier.location', read_only=True)
    material_name = serializers.CharField(source='material.name', read_only=True)
    material_category = serializers.CharField(source='material.category', read_only=True)
    material_description = serializers.CharField(source='material.description', read_only=True)

    class Meta:
        model = SupplierMaterial
        fields = [
            'id',
            'supplier',
            'material',
            'actual_price',
            'unit_of_measure',
            # etiquetas convenientes:
            'supplier_name',
            'supplier_location',
            'material_name',
            'material_category',
            'material_description',
        ]


class SupplierMaterialViewSet(viewsets.ModelViewSet):
    queryset = SupplierMaterial.objects.select_related('supplier','material').all()
    serializer_class = SupplierMaterialSerializer
    ordering = ['material__name']

    # /supplier-materials/?phase=<id> returns SMs whose material is linked to that phase
    def get_queryset(self):
        qs = super().get_queryset()
        phase_id = self.request.query_params.get('phase')
        if phase_id:
            qs = qs.filter(material__phases__id=phase_id)
        return qs

# --- PhaseMaterial (link Material to Phase)
class PhaseMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhaseMaterial
        fields = '__all__'

class PhaseMaterialViewSet(viewsets.ModelViewSet):
    queryset = PhaseMaterial.objects.all()
    serializer_class = PhaseMaterialSerializer

# --- Quote
class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'

class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer

    def get_queryset(self):
        qs = Quote.objects.all().select_related('phase')
        phase_id = self.request.query_params.get('phase')
        if phase_id:
            qs = qs.filter(phase_id=phase_id)
        return qs

# --- Quote items (QuoteSupplierMaterial)
class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteSupplierMaterial
        fields = '__all__'

class QuoteItemViewSet(viewsets.ModelViewSet):
    queryset = QuoteSupplierMaterial.objects.all().select_related('quote','supplierMaterial')
    serializer_class = QuoteItemSerializer

    filterset_fields = ['quote']