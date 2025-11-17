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
            return Actividad.objects.all().prefetch_related('becarios_asignados')
        else:
            # Becarios solo ven actividades que están en catálogo Y que están asignadas a ellos
            # O actividades que ellos mismos crearon
            return Actividad.objects.filter(
                Q(en_catalogo=True, becarios_asignados=user) | Q(creador=user)
            ).prefetch_related('becarios_asignados').distinct()
    
    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Listar actividades

        Retorna las actividades disponibles en el sistema.

        **Permisos:**
        - **Administradores:** Pueden ver todas las actividades
        - **Becarios:** Solo pueden ver actividades que están en catálogo y asignadas específicamente a ellos, o actividades que ellos mismos crearon
        """
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Obtener actividad específica

        Retorna los detalles de una actividad específica.

        **Permisos:**
        - **Administradores:** Pueden ver cualquier actividad
        - **Becarios:** Solo pueden ver actividades que están en catálogo y asignadas específicamente a ellos, o actividades que ellos mismos crearon
        """
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Crear actividad

        Permite crear una nueva actividad en el sistema.

        **Permisos:**
        - **Administradores:** Pueden elegir si la actividad va al catálogo (visible para becarios asignados)
        - **Becarios:** Las actividades se crean como privadas (no en catálogo)
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

        **Restricciones:**
        - No se puede eliminar una actividad si ya tiene registros de horas asociados

        **Permisos:**
        - **Administradores:** Pueden eliminar cualquier actividad (siempre que no tenga horas registradas)
        - **Becarios:** Solo pueden eliminar las actividades que han creado (siempre que no tenga horas registradas)
        """
    )
    def destroy(self, request, *args, **kwargs):
        actividad = self.get_object()

        # Verificar si la actividad tiene registros de horas
        from records.models import RegistroHoras
        if RegistroHoras.objects.filter(actividad=actividad).exists():
            return Response(
                {
                    'error': 'No se puede eliminar la actividad porque ya tiene registros de horas asociados.',
                    'detail': 'Para eliminar esta actividad, primero debe eliminar o reasignar todos los registros de horas relacionados.'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(creador=user)

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