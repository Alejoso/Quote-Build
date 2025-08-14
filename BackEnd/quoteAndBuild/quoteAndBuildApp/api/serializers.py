from rest_framework import serializers
from quoteAndBuildApp.models import SupplierMaterial

class MaterialSerializer(serializers.ModelSerializer):
    materialId = serializers.IntegerField(source='material_id.material_id')
    name = serializers.CharField(source='material_id.name')
    price = serializers.DecimalField(source='actual_price', max_digits=10, decimal_places=2)
    category = serializers.CharField(source='material_id.category')
    unitOfMeasure = serializers.CharField(source='unit_of_measure')
    supplier = serializers.SerializerMethodField()

    class Meta:
        model = SupplierMaterial
        fields = ['materialId', 'name', 'price', 'category', 'unitOfMeasure', 'supplier']

    def get_supplier(self, obj):
        return {
            'name': obj.nit.name,
            'location': obj.nit.location,
            'nit': obj.nit.nit,
        }
