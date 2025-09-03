from rest_framework import viewsets , serializers
from rest_framework.response import Response
from rest_framework import status as drf_status
from quoteAndBuildApp.models import Material , Project, Phase, Client, Supplier, SupplierMaterial, PhaseMaterial, Quote, QuoteSupplierMaterial, PhaseInterval
from django.utils import timezone

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
    projectDurationExecuted = serializers.SerializerMethodField()
    projectDurationPlanning = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_projectDurationExecuted(self, project):
        total_days = 0
        phases = Phase.objects.filter(project_id=project.id)
        for phase in phases:
            intervals = PhaseInterval.objects.filter(phase_id=phase.id)
            for interval in intervals:
                if interval.start_date and interval.end_date and not interval.is_planning_phase:
                    total_days += (interval.end_date - interval.start_date).days
        return total_days if total_days > 0 else None
    
    def get_projectDurationPlanning(self, project):
        total_days = 0
        phases = Phase.objects.filter(project_id=project.id)
        for phase in phases:
            intervals = PhaseInterval.objects.filter(phase_id=phase.id, is_planning_phase=True)
            for interval in intervals:
                if interval.start_date and interval.end_date:
                    total_days += (interval.end_date - interval.start_date).days
        return total_days if total_days > 0 else None

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
    phaseDurationExecuted = serializers.SerializerMethodField()
    phaseDurationPlanning = serializers.SerializerMethodField()

    class Meta:
        model = Phase
        fields = '__all__'
        # 'phaseDuration' se agrega automáticamente por SerializerMethodField

    def get_phaseDurationExecuted(self, phase):
        intervals = PhaseInterval.objects.filter(phase_id=phase.id)
        total_days = 0
        for interval in intervals:
            # Si end_date está en null, asignar fecha actual
            if interval.end_date is None:
                interval.end_date = timezone.now().date()
                interval.save(update_fields=["end_date"])
            if interval.start_date and interval.end_date and not interval.is_planning_phase:
                total_days += (interval.end_date - interval.start_date).days
        return total_days if total_days > 0 else None
    
    def get_phaseDurationPlanning(self, phase):
        intervals = PhaseInterval.objects.filter(phase_id=phase.id, is_planning_phase=True)
        total_days = 0
        for interval in intervals:
            if interval.start_date and interval.end_date:
                total_days += (interval.end_date - interval.start_date).days
        return total_days if total_days > 0 else None
        
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
    
    def destroy(self, request, *args, **kwargs):
        quote = self.get_object()

        # Check if quote is in draft status
        # If not, return conflict
        if quote.status != "draft":
            return Response(
                {
                    "detail": "Solo podes borrar cotizaciones en estado draft.",
                    "quote_id": quote.pk,
                    "status": quote.status,
                },
                status=drf_status.HTTP_409_CONFLICT,
            )
        # If it is draft, delete as normal
        return super().destroy(request, *args, **kwargs)

# --- Quote items (QuoteSupplierMaterial)
class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteSupplierMaterial
        fields = '__all__'

class QuoteItemViewSet(viewsets.ModelViewSet):
    queryset = QuoteSupplierMaterial.objects.all().select_related('quote','supplierMaterial')
    serializer_class = QuoteItemSerializer

    filterset_fields = ['quote']