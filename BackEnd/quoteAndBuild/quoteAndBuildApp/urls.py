from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, ProjectViewSet, PhaseViewSet, QuoteViewSet


router = DefaultRouter()
router.register(r'materials' , MaterialViewSet , basename='materials')
router.register(r'projects' , ProjectViewSet , basename='projects')
router.register(r'phases' , PhaseViewSet , basename='phases')
router.register(r'quotes', QuoteViewSet, basename='quotes')

urlpatterns = [
    path('', include(router.urls)),
]
