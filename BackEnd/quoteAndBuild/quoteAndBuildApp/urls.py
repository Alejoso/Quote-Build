from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MaterialViewSet, ProjectViewSet, PhaseViewSet,  SupplierViewSet, SupplierMaterialViewSet, PhaseMaterialViewSet, QuoteViewSet, QuoteItemViewSet, PhaseIntervalViewSet


router = DefaultRouter()
router.register(r'materials' , MaterialViewSet , basename='materials')
router.register(r'projects' , ProjectViewSet , basename='projects')
router.register(r'phases' , PhaseViewSet , basename='phases')
router.register(r'suppliers', SupplierViewSet, basename='suppliers')
router.register(r'supplier-materials', SupplierMaterialViewSet, basename='supplier-materials')
router.register(r'phase-materials', PhaseMaterialViewSet, basename='phase-materials')
router.register(r'quotes', QuoteViewSet, basename='quotes')
router.register(r'quote-items', QuoteItemViewSet, basename='quote-items')
router.register(r'phase-intervals', PhaseIntervalViewSet, basename='phase-intervals')


urlpatterns = [
    path('', include(router.urls)),
]