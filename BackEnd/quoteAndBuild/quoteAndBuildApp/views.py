from rest_framework import viewsets , serializers

from quoteAndBuildApp.models import Material , Supplier , SupplierMaterial
#from django.core import serializers as sr 


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class MaterialViewSet (viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    



