from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Actividad
from .serializers import ActividadSerializer, ActividadCreateSerializer, AsignarBecariosSerializer
from users.permissions import IsAdministrador
from drf_spectacular.utils import extend_schema

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
            return Actividad.objects.filter(is_active=True).prefetch_related('becarios_asignados')
        else:
            return Actividad.objects.filter(
                Q(en_catalogo=True) | Q(creador=user) | Q(becarios_asignados=user)
            ).prefetch_related('becarios_asignados').distinct()
        
    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Desactivar actividad
        
        Desactiva una actividad (soft delete) en lugar de eliminarla permanentemente.
        La actividad ya no será visible para los becarios pero sus datos se mantienen.
        
        **Permisos:**
        - **Administradores:** Pueden desactivar cualquier actividad
        - **Becarios:** No tienen acceso a esta funcionalidad
        """
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdministrador])
    def desactivar(self, request, pk=None):
        actividad = self.get_object()
        actividad.is_active = False
        actividad.save()
        
        return Response({
            'message': f'Actividad "{actividad.titulo}" desactivada correctamente',
            'actividad_id': actividad.id,
            'estado': 'desactivada'
        })
    
    # NUEVO: Endpoint para reactivar actividad
    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Reactivar actividad
        
        Reactiva una actividad que había sido desactivada previamente.
        
        **Permisos:**
        - **Administradores:** Pueden reactivar cualquier actividad
        - **Becarios:** No tienen acceso a esta funcionalidad
        """
    )
    @action(detail=True, methods=['post'], permission_classes=[IsAdministrador])
    def reactivar(self, request, pk=None):
        try:
            actividad = Actividad.objects.get(id=pk, is_active=False)
            actividad.is_active = True
            actividad.save()
            
            return Response({
                'message': f'Actividad "{actividad.titulo}" reactivada correctamente',
                'actividad_id': actividad.id,
                'estado': 'activada'
            })
        except Actividad.DoesNotExist:
            return Response(
                {'error': 'Actividad no encontrada o ya está activa'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Listar actividades
        
        Retorna las actividades disponibles en el sistema.
        
        **Permisos:**
        - **Administradores:** Pueden ver todas las actividades
        - **Becarios:** Solo pueden ver actividades del catálogo, las que han creado y las asignadas a ellos
        """
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Obtener actividad específica
        
        Retorna los detalles de una actividad específica.
        
        **Permisos:**
        - **Administradores:** Pueden ver cualquier actividad
        - **Becarios:** Solo pueden ver actividades del catálogo, las que han creado y las asignadas a ellos
        """
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Crear actividad
        
        Permite crear una nueva actividad en el sistema.
        
        **Permisos:**
        - **Administradores:** Las actividades se crean automáticamente en el catálogo
        - **Becarios:** Las actividades se crean como pendientes de aprobación
        """
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Actualizar actividad
        
        Permite modificar una actividad existente.
        
        **Permisos:**
        - **Administradores:** Pueden modificar cualquier actividad
        - **Becarios:** Solo pueden modificar las actividades que han creado
        """
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Actualización parcial de actividad
        
        Permite modificar parcialmente una actividad existente.
        
        **Permisos:**
        - **Administradores:** Pueden modificar cualquier actividad
        - **Becarios:** Solo pueden modificar las actividades que han creado
        """
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Eliminar actividad
        
        Permite eliminar una actividad del sistema.
        
        **Permisos:**
        - **Administradores:** Pueden eliminar cualquier actividad
        - **Becarios:** Solo pueden eliminar las actividades que han creado
        """
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = self.request.user
        if user.rol == 'administrador':
            serializer.save(creador=user, en_catalogo=True)
        else:
            serializer.save(creador=user, en_catalogo=False)

    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Asignar becarios a actividad
        
        Permite asignar uno o múltiples becarios a una actividad específica.
        
        **Permisos:**
        - **Administradores:** Pueden asignar becarios a cualquier actividad
        - **Becarios:** No tienen acceso a esta funcionalidad
        """
    )
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

    @extend_schema(
        description="""**🎓 SOLO BECARIOS** - Ver mis actividades asignadas
        
        Retorna la lista de actividades que han sido asignadas al becario autenticado.
        
        **Permisos:**
        - **Becarios:** Pueden ver sus actividades asignadas
        - **Administradores:** No tienen acceso a este endpoint
        """
    )
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

    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Quitar becarios de actividad
        
        Permite remover uno o múltiples becarios de una actividad específica.
        
        **Permisos:**
        - **Administradores:** Pueden quitar becarios de cualquier actividad
        - **Becarios:** No tienen acceso a esta funcionalidad
        """
    )
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