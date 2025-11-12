from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RegistroHoras
from .serializers import (RegistroHorasSerializer, RegistroHorasCreateSerializer, 
                         AprobarRechazarSerializer)
from users.permissions import IsAdministrador
from drf_spectacular.utils import extend_schema

class RegistroHorasViewSet(viewsets.ModelViewSet):
    queryset = RegistroHoras.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return RegistroHorasCreateSerializer
        return RegistroHorasSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.rol == 'administrador':
            return RegistroHoras.objects.all().select_related('becario', 'actividad')
        else:
            return RegistroHoras.objects.filter(becario=user).select_related('actividad')
    
    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Listar registros de horas
        
        Retorna los registros de horas reportadas en el sistema.
        
        **Permisos:**
        - **Administradores:** Pueden ver todos los registros de todos los usuarios
        - **Becarios:** Solo pueden ver sus propios registros
        """
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Obtener registro específico
        
        Retorna los detalles de un registro de horas específico.
        
        **Permisos:**
        - **Administradores:** Pueden ver cualquier registro
        - **Becarios:** Solo pueden ver sus propios registros
        """
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        description="""**🎓 SOLO BECARIOS** - Crear registro de horas
        
        Permite a un becario reportar horas en una actividad.
        El registro se crea con estado "Pendiente" hasta que un administrador lo apruebe.
        """
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        description="""**🎓 SOLO BECARIOS** - Actualizar registro de horas
        
        Permite a un becario modificar sus propios registros de horas.
        Solo se pueden modificar registros en estado "Pendiente".
        """
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        description="""**🎓 SOLO BECARIOS** - Actualización parcial de registro
        
        Permite a un becario modificar parcialmente sus propios registros de horas.
        Solo se pueden modificar registros en estado "Pendiente".
        """
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        description="""**🎓 SOLO BECARIOS** - Eliminar registro de horas
        
        Permite a un becario eliminar sus propios registros de horas.
        Solo se pueden eliminar registros en estado "Pendiente".
        """
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    def perform_create(self, serializer):
        serializer.save(becario=self.request.user)
    
    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Ver registros pendientes
        
        Retorna todos los registros de horas que están pendientes de aprobación.
        
        **Permisos:**
        - **Administradores:** Acceso completo a todos los registros pendientes
        """
    )
    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        if request.user.rol != 'administrador':
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        registros_pendientes = RegistroHoras.objects.filter(
            estado_aprobacion='P'
        ).select_related('becario', 'actividad')
        serializer = self.get_serializer(registros_pendientes, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Aprobar o rechazar registro
        
        Permite a un administrador aprobar o rechazar un registro de horas pendiente.
        
        **Acciones disponibles:**
        - `aprobar`: Cambia el estado del registro a "Aprobado"
        - `rechazar`: Cambia el estado del registro a "Rechazado"
        """
    )
    @action(detail=True, methods=['post'])
    def aprobar_rechazar(self, request, pk=None):
        if request.user.rol != 'administrador':
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        registro = self.get_object()
        serializer = AprobarRechazarSerializer(data=request.data)
        
        if serializer.is_valid():
            accion = serializer.validated_data['accion']
            
            if accion == 'aprobar':
                registro.estado_aprobacion = 'A'
            elif accion == 'rechazar':
                registro.estado_aprobacion = 'R'
            
            registro.fecha_aprobacion = timezone.now()
            registro.administrador_aprobo = request.user
            registro.save()
            
            return Response({'message': f'Registro {accion}ado correctamente'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)