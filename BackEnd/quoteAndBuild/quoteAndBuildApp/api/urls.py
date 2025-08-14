from rest_framework.routers import DefaultRouter
from quoteAndBuildApp.api.views import MaterialViewSet

router = DefaultRouter()
router.register('material', MaterialViewSet, basename='material')

urlpatterns = router.urls
