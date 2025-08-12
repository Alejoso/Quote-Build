from django.contrib import admin
from django.urls import path , include
from quoteAndBuildApp.api.views import MaterialViewSet

urlpatterns = [
    path('admin/' , admin.site.urls),
    path('api/' , include('quoteAndBuildApp.api.urls'))
]