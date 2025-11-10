from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token 
from django.db import models
from .models import Usuario
from .serializers import UsuarioSerializer, LoginSerializer, UsuarioCreateSerializer
from .permissions import IsAdministrador, IsOwnerOrAdmin

class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'token': token.key,
                'user': UsuarioSerializer(user).data,
                'message': 'Inicio de sesión exitoso'
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def registrar_password(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            user = Usuario.objects.get(email=email)
            if user.has_usable_password():
                return Response({'error': 'El usuario ya tiene contraseña registrada'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(password)
            user.save()
            return Response({'message': 'Contraseña registrada exitosamente'})
        except Usuario.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, 
                          status=status.HTTP_404_NOT_FOUND)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer
    
    def get_queryset(self):
        user = self.request.user
        # NUEVO: Incluir prefetch para optimizar consultas
        queryset = Usuario.objects.all().prefetch_related('actividades_asignadas')
        if user.rol == 'administrador':
            return queryset
        elif user.rol == 'becario':
            return queryset.filter(id=user.id)
        return Usuario.objects.none()
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdministrador()]
        return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
    
    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    # NUEVO: Endpoint para asignar actividades a un becario
    @action(detail=True, methods=['post'], permission_classes=[IsAdministrador])
    def asignar_actividades(self, request, pk=None):
        usuario = self.get_object()
        
        # Verificar que el usuario sea un becario
        if usuario.rol != 'becario':
            return Response(
                {'error': 'Solo se pueden asignar actividades a becarios'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        actividades_ids = request.data.get('actividades_ids', [])
        
        # Verificar que las actividades existan
        from activities.models import Actividad
        actividades = Actividad.objects.filter(id__in=actividades_ids)
        
        if len(actividades) != len(actividades_ids):
            return Response(
                {'error': 'Algunas actividades no existen'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Asignar las actividades al becario
        usuario.actividades_asignadas.add(*actividades)
        
        return Response({
            'message': f'Se asignaron {len(actividades)} actividades al becario',
            'becario': f"{usuario.first_name} {usuario.last_name}",
            'actividades_asignadas': [actividad.titulo for actividad in actividades]
        })