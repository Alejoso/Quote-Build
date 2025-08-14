from rest_framework import serializers
from decimal import Decimal
from quoteAndBuildApp.models import Material , Project, Phase, Quotes, QuoteSupplierMaterial, SupplierMaterial

class MaterialListSerializer(serializers.ModelSerializer):
    supplierMaterialId = serializers.IntegerField(source='supplier_material_id', read_only=True)
    materialId         = serializers.IntegerField(source='material_id.material_id', read_only=True)
    name               = serializers.CharField(source='material_id.name', read_only=True)
    price              = serializers.DecimalField(source='actual_price', max_digits=30, decimal_places=2)
    category           = serializers.CharField(source='material_id.category', read_only=True)
    unitOfMeasure      = serializers.CharField(source='unit_of_measure', read_only=True)
    supplier           = serializers.SerializerMethodField()

    class Meta:
        model  = SupplierMaterial
        fields = (
            'supplierMaterialId',
            'materialId',
            'name',
            'price',
            'category',
            'unitOfMeasure',
            'supplier',
        )

    def get_supplier(self, obj):
        s = obj.nit  # FK a Supplier
        return {"name": s.name, "location": s.location, "nit": s.nit}

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        

def dec_to_str(d: Decimal | None) -> str | None:
    return f"{d:.2f}" if d is not None else None

class ProjectDeepSerializer(serializers.Serializer):
    """Devuelve el JSON completo de un proyecto con fases, cotizaciones y renglones.
       Formato compatible con tu ProyectoContext (ProjectJSON)."""

    def to_representation(self, project: Project):
        # Prefetch ya optimizado si la vista lo hace; aquí solo construimos el dict.
        return {
            "project_id": project.project_id,
            "name": project.name,
            "location": project.location,
            "total": dec_to_str(project.total),
            "phases": [
                {
                    "phase_id": ph.phase_id,
                    "name": ph.name,
                    "description": ph.description,
                    "total": dec_to_str(ph.total),
                    "quotes": [
                        {
                            "quote_id": qt.quote_id,
                            "quote_date": qt.quote_date.isoformat(),
                            "description": qt.description,
                            "is_first_quote": qt.is_first_quote,
                            "total": dec_to_str(qt.total),
                            "supplier_materials": [
                                {
                                    "supplier_material_id": sm.supplier_material_id_id,
                                    "quantity": f"{sm.quantity:.2f}",
                                    "unit_price": f"{sm.unit_price:.2f}",
                                    "subtotal": dec_to_str(sm.subtotal),
                                }
                                for sm in qt.supplier_materials.all()
                            ],
                        }
                        for qt in ph.quotes.all()
                    ],
                }
                for ph in project.phases.all()
            ],
        }
    
# serializers.py
from decimal import Decimal
from typing import Any, Dict, List
from rest_framework import serializers
from django.db import transaction

# ---------- SupplierMaterial en una cotización ----------
class QuoteSupplierMaterialCreateSerializer(serializers.Serializer):
    supplier_material_id = serializers.PrimaryKeyRelatedField(
        queryset=SupplierMaterial.objects.all(), source="supplier_material"
    )
    quantity = serializers.DecimalField(max_digits=30, decimal_places=2)
    unit_price = serializers.DecimalField(max_digits=30, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=30, decimal_places=2, required=False, allow_null=True)

# ---------- Cotización ----------
class QuoteCreateSerializer(serializers.Serializer):
    quote_date = serializers.DateField()
    description = serializers.CharField(allow_blank=True, required=False)
    is_first_quote = serializers.BooleanField()
    total = serializers.DecimalField(max_digits=30, decimal_places=2, required=False, allow_null=True)
    supplier_materials_id = QuoteSupplierMaterialCreateSerializer(many=True, required=False)

    def create(self, validated_data: Dict[str, Any]) -> Quotes:
        supplier_materials: List[Dict[str, Any]] = validated_data.pop("supplier_materials", [])
        phase: Phase = self.context["phase"]  # pasada desde el Phase serializer

        quote = Quotes.objects.create(phase_id=phase, **validated_data)

        # Crear renglones y calcular subtotal si no viene
        sum_subtotals = Decimal("0.00")
        for item in supplier_materials:
            supplier_material = item["supplier_material"]
            qty = item["quantity"]
            price = item["unit_price"]
            subtotal = item.get("subtotal")
            if subtotal is None:
                subtotal = qty * price

            QuoteSupplierMaterial.objects.create(
                quote_id=quote,
                supplier_material_id=supplier_material,
                quantity=qty,
                unit_price=price,
                subtotal=subtotal,
            )
            sum_subtotals += subtotal

        # Si no vino total de la cotización, lo calculamos
        if quote.total is None:
            quote.total = sum_subtotals
            quote.save(update_fields=["total"])

        return quote

    def to_representation(self, instance: Quotes) -> Dict[str, Any]:
        return {
            "quote_id": instance.quote_id,
            "quote_date": instance.quote_date.isoformat(),
            "description": instance.description,
            "is_first_quote": instance.is_first_quote,
            "total": f"{instance.total:.2f}" if instance.total is not None else None,
            "supplier_materials": [
                {
                    "supplier_material_id": sm.supplier_material_id_id,
                    "quantity": f"{sm.quantity:.2f}",
                    "unit_price": f"{sm.unit_price:.2f}",
                    "subtotal": f"{(sm.subtotal or Decimal('0')).quantize(Decimal('0.01'))}",
                }
                for sm in instance.supplier_materials.all()
            ],
        }

# ---------- Fase ----------
class PhaseCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    description = serializers.CharField(allow_blank=True, required=False, allow_null=True)
    total = serializers.DecimalField(max_digits=30, decimal_places=2, required=False, allow_null=True)
    quotes = QuoteCreateSerializer(many=True, required=False)

    def create(self, validated_data: Dict[str, Any]) -> Phase:
        quotes_data = validated_data.pop("quotes", [])
        project: Project = self.context["project"]

        phase = Phase.objects.create(project_id=project, **validated_data)

        # Crear cotizaciones
        created_quotes: List[Quotes] = []
        for qd in quotes_data:
            quote = QuoteCreateSerializer(data=qd, context={"phase": phase})
            quote.is_valid(raise_exception=True)
            created_quotes.append(quote.save())

        # Si no vino total de la fase, sumamos sus cotizaciones
        if phase.total is None:
            total_phase = sum((q.total or Decimal("0.00")) for q in created_quotes)
            phase.total = total_phase
            phase.save(update_fields=["total"])

        return phase

    def to_representation(self, instance: Phase) -> Dict[str, Any]:
        return {
            "phase_id": instance.phase_id,
            "name": instance.name,
            "description": instance.description,
            "total": f"{instance.total:.2f}" if instance.total is not None else None,
            "quotes": QuoteCreateSerializer(instance.quotes.all(), many=True).data,
        }

# ---------- Proyecto ----------
class ProjectCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    location = serializers.CharField()
    total = serializers.DecimalField(max_digits=30, decimal_places=2, required=False, allow_null=True)
    phases = PhaseCreateSerializer(many=True, required=False)

    @transaction.atomic
    def create(self, validated_data: Dict[str, Any]) -> Project:
        phases_data = validated_data.pop("phases", [])
        project = Project.objects.create(**validated_data)

        created_phases: List[Phase] = []
        for pd in phases_data:
            phase = PhaseCreateSerializer(data=pd, context={"project": project})
            phase.is_valid(raise_exception=True)
            created_phases.append(phase.save())

        # Si no vino total del proyecto, sumamos totales de fases
        if project.total is None:
            project.total = sum((ph.total or Decimal("0.00")) for ph in created_phases)
            project.save(update_fields=["total"])

        return project

    def to_representation(self, instance: Project) -> Dict[str, Any]:
        return {
            "project_id": instance.project_id,
            "name": instance.name,
            "location": instance.location,
            "total": f"{instance.total:.2f}" if instance.total is not None else None,
            "phases": PhaseCreateSerializer(instance.phases.all(), many=True).data,
        }
