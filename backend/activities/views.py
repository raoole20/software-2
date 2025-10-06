from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Actividad
from .serializers import ActividadSerializer, ActividadCreateSerializer
from users.permissions import IsAdministrador, IsAdminOrReadOnly

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    serializer_class = ActividadSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update']:
            return ActividadCreateSerializer
        return ActividadSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.rol == 'administrador':
            return Actividad.objects.all()
        else:
            return Actividad.objects.filter(
                Q(en_catalogo=True) | Q(creador=user)
            )
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.rol == 'administrador':
            serializer.save(creador=user, en_catalogo=True)
        else:
            serializer.save(creador=user, en_catalogo=False)
    
    @action(detail=False, methods=['get'])
    def catalogo(self, request):
        actividades = Actividad.objects.filter(en_catalogo=True)
        serializer = self.get_serializer(actividades, many=True)
        return Response(serializer.data)