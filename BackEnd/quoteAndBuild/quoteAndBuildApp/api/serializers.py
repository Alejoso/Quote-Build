from rest_framework import serializers
from quoteAndBuildApp.models import Material , Project, Phase, Quotes, QuoteSupplierMaterial, SupplierMaterial

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

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
    supplier_materials = QuoteSupplierMaterialCreateSerializer(many=True, required=False)

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
