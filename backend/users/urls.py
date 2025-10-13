from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('auth', views.AuthViewSet, basename='auth')
router.register('usuarios', views.UsuarioViewSet)

urlpatterns = [
    path('', include(router.urls)),
]