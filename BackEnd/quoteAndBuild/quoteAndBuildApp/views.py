from rest_framework import viewsets , serializers , status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status as drf_status
from quoteAndBuildApp.models import Material , Project, Phase, Client, Supplier, SupplierMaterial, SupplierPhone, PhaseMaterial, Quote, QuoteSupplierMaterial, PhaseInterval
from django.utils import timezone
from decimal import Decimal
from django.db import transaction
from django.db.models import Sum
from django.db.models.functions import Coalesce
import base64
from io import BytesIO





#from django.core import serializers as sr 

# Material
class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class MaterialViewSet (viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        nit = self.request.query_params.get('nit')
        if nit:
            qs = qs.filter(providers__nit=nit)
        return qs
    

# Project
class ProjectSerializer(serializers.ModelSerializer):
    projectDurationExecuted = serializers.SerializerMethodField()
    projectDurationPlanning = serializers.SerializerMethodField()
    projectTotalCostExecuted = serializers.SerializerMethodField()
    projectTotalCostPlanned = serializers.SerializerMethodField()

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
    
    #Cost
    def get_projectTotalCostExecuted(self, project):
        total = 0
        phases = Phase.objects.filter(project_id=project.id)
        for phase in phases:
            quotes = Quote.objects.filter(phase_id=phase.id, status='completed')
            for quote in quotes:
                if (quote.is_first_quote==False):
                    total += quote.total if quote.total else 0
        return total if total > 0 else None
    
    def get_projectTotalCostPlanned(self, project):
        total = 0
        phases = Phase.objects.filter(project_id=project.id)
        for phase in phases:
            quotes = Quote.objects.filter(phase_id=phase.id, is_first_quote=True)
            for quote in quotes:
                if (quote.is_first_quote==False):
                    total += quote.total if quote.total else 0
        return total if total > 0 else None

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
    phaseTotalCostExecuted = serializers.SerializerMethodField()
    phaseTotalCostPlanned = serializers.SerializerMethodField()

    materialsCostPlanned = serializers.SerializerMethodField()
    materialsCostExecuted = serializers.SerializerMethodField()

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

    def get_phaseTotalCostExecuted(self, phase):
        quotesExecuted = Quote.objects.filter(phase_id=phase.id, status='completed')
        total = sum(quote.total for quote in quotesExecuted if quote.total)
        return total if total > 0 else None
    
    def get_phaseTotalCostPlanned(self, phase):
        quotesPlanned = Quote.objects.filter(phase_id=phase.id, is_first_quote=True)
        total = sum(quote.total for quote in quotesPlanned if quote.total)
        return total if total > 0 else None
    
    def get_materialsCostPlanned(self, phase):
        material_costs = {}
        quotes = Quote.objects.filter(phase_id=phase.id, is_first_quote=True)
        for quote in quotes:
            for item in quote.quotesuppliermaterial_set.all():
                material_name = item.supplierMaterial.material.name
                if material_name not in material_costs:
                    material_costs[material_name] = 0
                material_costs[material_name] += item.subtotal or 0
        return material_costs

    def get_materialsCostExecuted(self, phase):
        material_costs = {}
        quotes = Quote.objects.filter(phase_id=phase.id, status='completed')
        for quote in quotes:
            for item in quote.quotesuppliermaterial_set.all():
                material_name = item.supplierMaterial.material.name
                if material_name not in material_costs:
                    material_costs[material_name] = 0
                material_costs[material_name] += item.subtotal or 0
        return material_costs


class PhaseViewSet(viewsets.ModelViewSet):
    serializer_class = PhaseSerializer

    def get_queryset(self):
        qs = Phase.objects.all()
        # Optional filter to list phases for a specific project: /phases/?project=1
        project_id = self.request.query_params.get('project')
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs
    
    def destroy(self, request, *args, **kwargs):
        phase = self.get_object()

        # If there is a SINGLE draft quote, block the deletion :P
        if phase.quotes.exclude(status="draft").exists():
            return Response(
                {
                    "detail": "Solo podés borrar fases que no tengan cotizaciones en estado 'draft'.",
                    "phase_id": phase.pk,
                },
                status=drf_status.HTTP_409_CONFLICT,
            )

        return super().destroy(request, *args, **kwargs)

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

        material_id = self.request.query_params.get('material')
        if material_id:
            qs = qs.filter(material_id=material_id)

        supplier_nit = self.request.query_params.get('supplier')
        if supplier_nit:
            qs = qs.filter(supplier__nit=supplier_nit)
        return qs

# Serializer para SupplierPhone
class SupplierPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierPhone
        fields = '__all__'

# ViewSet para SupplierPhone
class SupplierPhoneViewSet(viewsets.ModelViewSet):
    queryset = SupplierPhone.objects.all()
    serializer_class = SupplierPhoneSerializer

    
    def get_queryset(self):
        supplier_nit = self.request.query_params.get('supplier')
        qs = super().get_queryset()
        if supplier_nit:
            qs = qs.filter(supplier__nit=supplier_nit)
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
    
    @action(detail=True, methods=["post"], url_path="set-status") # This allow us to access to set - status path ( This is call a decorator)
    def set_status(self, request, pk=None):
        try:
            quote = Quote.objects.get(pk=pk)
        except Quote.DoesNotExist:
            return Response({"detail": "Cotización no encontrada."}, status=404)

        new_status = request.data.get("status")
        if new_status not in ["draft", "completed"]:
            return Response({"detail": "Estado inválido."}, status=400)

        quote.status = new_status
        quote.save()

        serializer = self.get_serializer(quote)
        return Response(serializer.data, status=200)
    
    def save(self, *args, **kwargs):
        total = 0

        quote = self.get_object()

        related_qsm = QuoteSupplierMaterial.objects.filter(quote_id=quote.id)
        
        for qsm in related_qsm:
            total = total + qsm.subtotal
        
        self.total = total
        super().save(*args, **kwargs)

# --- Helpers to clculate totals ---
def _recalc_quote_total(quote):
    total = QuoteSupplierMaterial.objects.filter(quote=quote).aggregate(
        s=Coalesce(Sum('subtotal'), Decimal('0'))
    )['s']
    Quote.objects.filter(pk=quote.pk).update(total=total)

def _recalc_phase_total(phase):
    total = Quote.objects.filter(phase=phase).aggregate(
        s=Coalesce(Sum('total'), Decimal('0'))
    )['s']
    Phase.objects.filter(pk=phase.pk).update(total=total)

def _recalc_project_total(project):
    total = Phase.objects.filter(project=project).aggregate(
        s=Coalesce(Sum('total'), Decimal('0'))
    )['s']
    Project.objects.filter(pk=project.pk).update(total=total)

def _recalc_chain(quote):
    _recalc_quote_total(quote)
    _recalc_phase_total(quote.phase)
    _recalc_project_total(quote.phase.project)

# --- Quote items (QuoteSupplierMaterial) ---
class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteSupplierMaterial
        fields = '__all__'

    def validate(self, attrs):
        qty = attrs.get('quantity', getattr(self.instance, 'quantity', None))
        up  = attrs.get('unit_price', getattr(self.instance, 'unit_price', None))
        if qty is not None and up is not None:
            attrs['subtotal'] = Decimal(qty) * Decimal(up)
        return attrs

class QuoteItemViewSet(viewsets.ModelViewSet):
    queryset = QuoteSupplierMaterial.objects.all().select_related(
        'quote','supplierMaterial','quote__phase','quote__phase__project'
    )
    serializer_class = QuoteItemSerializer
    filterset_fields = ['quote']

    def get_queryset(self):
        qs = self.queryset
        quote_id = self.request.query_params.get('quote')
        if quote_id:
            qs = qs.filter(quote_id=quote_id)
            print(qs)
        return qs

    @transaction.atomic
    def perform_create(self, serializer):
        item = serializer.save()
        _recalc_chain(item.quote)

    @transaction.atomic
    def perform_update(self, serializer):
        item = serializer.save()
        _recalc_chain(item.quote)

    @transaction.atomic
    def perform_destroy(self, instance):
        quote = instance.quote
        super().perform_destroy(instance)
        _recalc_chain(quote)
