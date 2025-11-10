from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Actividad
from .serializers import ActividadSerializer, ActividadCreateSerializer, AsignarBecariosSerializer
from users.permissions import IsAdministrador

class ActividadViewSet(viewsets.ModelViewSet):
    queryset = Actividad.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return ActividadCreateSerializer
        return ActividadSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.rol == 'administrador':
            return Actividad.objects.all().prefetch_related('becarios_asignados')
        else:
            return Actividad.objects.filter(
                Q(en_catalogo=True) | Q(creador=user) | Q(becarios_asignados=user)
            ).prefetch_related('becarios_asignados').distinct()
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.rol == 'administrador':
            serializer.save(creador=user, en_catalogo=True)
        else:
            serializer.save(creador=user, en_catalogo=False)

    #  asignar becarios a una actividad
    @action(detail=True, methods=['post'], permission_classes=[IsAdministrador])
    def asignar_becarios(self, request, pk=None):
        actividad = self.get_object()
        serializer = AsignarBecariosSerializer(data=request.data)
        
        if serializer.is_valid():
            becarios_ids = serializer.validated_data['becarios_ids']
            
            # Verificar que los IDs correspondan a becarios
            from users.models import Usuario
            becarios = Usuario.objects.filter(
                id__in=becarios_ids, 
                rol='becario'
            )
            
            if len(becarios) != len(becarios_ids):
                return Response(
                    {'error': 'Algunos IDs no corresponden a becarios válidos'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Asignar becarios a la actividad
            actividad.becarios_asignados.set(becarios)
            actividad.save()
            
            return Response({
                'message': f'Se asignaron {len(becarios)} becarios a la actividad',
                'actividad': actividad.titulo,
                'becarios_asignados': [f"{b.first_name} {b.last_name}" for b in becarios]
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ver actividades asignadas (para becarios)
    @action(detail=False, methods=['get'])
    def mis_actividades_asignadas(self, request):
        if request.user.rol != 'becario':
            return Response(
                {'error': 'Solo los becarios pueden ver sus actividades asignadas'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        actividades = Actividad.objects.filter(becarios_asignados=request.user)
        serializer = self.get_serializer(actividades, many=True)
        return Response(serializer.data)

    # quitar becarios de una actividad
    @action(detail=True, methods=['post'], permission_classes=[IsAdministrador])
    def quitar_becarios(self, request, pk=None):
        actividad = self.get_object()
        serializer = AsignarBecariosSerializer(data=request.data)
        
        if serializer.is_valid():
            becarios_ids = serializer.validated_data['becarios_ids']
            
            # Quitar becarios de la actividad
            actividad.becarios_asignados.remove(*becarios_ids)
            actividad.save()
            
            return Response({
                'message': f'Se quitaron {len(becarios_ids)} becarios de la actividad',
                'actividad': actividad.titulo
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)