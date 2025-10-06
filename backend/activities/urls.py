from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('actividades', views.ActividadViewSet)

urlpatterns = [
    path('', include(router.urls)),
]