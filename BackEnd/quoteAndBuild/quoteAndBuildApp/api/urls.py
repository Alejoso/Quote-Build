# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from quoteAndBuildApp.api.views import MaterialViewSet , ProjectViewSet

from quoteAndBuildApp.api.ProjectCreateAPIView import ProjectCreateAPIView  # ← tu APIView
from quoteAndBuildApp.api.views import materials_list

router = DefaultRouter()
router.register(r'material', MaterialViewSet, basename='material')
router.register(r'project',  ProjectViewSet,  basename='project')

urlpatterns = [
    path('', include(router.urls)),
    path('insertNewProject/', ProjectCreateAPIView.as_view(), name='insertNewProject'),
    path("api/materials/", materials_list, name="materials-list")
]
