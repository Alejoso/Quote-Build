from rest_framework.routers import DefaultRouter
from quoteAndBuildApp.api.views import MaterialViewSet, ProjectViewSet

router = DefaultRouter() 
router.register('material', MaterialViewSet, basename='material')
router.register('projects', ProjectViewSet, basename='projects')
urlpatterns = router.urls