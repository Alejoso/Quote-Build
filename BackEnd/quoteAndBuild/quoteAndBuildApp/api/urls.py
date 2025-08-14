# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from quoteAndBuildApp.api.views import MaterialViewSet
from quoteAndBuildApp.api.ProjectCreateAPIView import ProjectCreateAPIView  # ← tu APIView

router = DefaultRouter()
router.register(r'material', MaterialViewSet, basename='material')

urlpatterns = [
    path('', include(router.urls)),  # /material/ (GET/POST según tu viewset)
    path('insertNewProject/', ProjectCreateAPIView.as_view(), name='insertNewProject'),  # ← APIView
]
