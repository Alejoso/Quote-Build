from quoteAndBuildApp.models import Material
from django.core import serializers
from pprint import pprint

def run():
    client = Material.objects.all()
    clintJson = serializers.serialize("json" , client)
    print(clintJson)
    clientNormal = serializers.deserialize("json" , clintJson)
    for obj in clientNormal:
        print(obj.object)

    
