# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
<<<<<<< HEAD

from quoteAndBuildApp.api.views import MaterialViewSet
from quoteAndBuildApp.api.ProjectCreateAPIView import ProjectCreateAPIView  # ← tu APIView

router = DefaultRouter()
router.register(r'material', MaterialViewSet, basename='material')

urlpatterns = [
    path('', include(router.urls)),  # /material/ (GET/POST según tu viewset)
    path('insertNewProject/', ProjectCreateAPIView.as_view(), name='insertNewProject'),  # ← APIView
]
=======
from quoteAndBuildApp.api.views import MaterialViewSet, ProjectViewSet

router = DefaultRouter() 
router.register('material', MaterialViewSet, basename='material')
router.register('projects', ProjectViewSet, basename='projects')
urlpatterns = router.urls
>>>>>>> 5fb0dbf51791ca176c94ac2d37338c01eae3ffe8
