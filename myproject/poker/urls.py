from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'sessions', views.SessionViewSet, basename='session')
router.register(r'playernotes', views.PlayerNoteViewSet, basename='playernote')

urlpatterns = [
    path('', include(router.urls)),
]
