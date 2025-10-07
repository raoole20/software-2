from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import RegistroHoras
from .serializers import (RegistroHorasSerializer, RegistroHorasCreateSerializer, 
                         AprobarRechazarSerializer)
from users.permissions import IsAdministrador

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
    
    def perform_create(self, serializer):
        serializer.save(becario=self.request.user)
    
    @action(detail=False, methods=['get'])
    def pendientes(self, request):
        if request.user.rol != 'administrador':
            return Response({'error': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)
        
        registros_pendientes = RegistroHoras.objects.filter(
            estado_aprobacion='P'
        ).select_related('becario', 'actividad')
        serializer = self.get_serializer(registros_pendientes, many=True)
        return Response(serializer.data)
    
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