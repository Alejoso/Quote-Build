from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, ProjectViewSet


router = DefaultRouter()
router.register(r'materials' , MaterialViewSet , basename='materials')
router.register(r'projects' , ProjectViewSet , basename='projects')

urlpatterns = [
    path('', include(router.urls)),
]
