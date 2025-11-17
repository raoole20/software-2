from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.db import models, IntegrityError
from .models import Usuario
from .serializers import UsuarioSerializer, LoginSerializer, UsuarioCreateSerializer, ConfiguracionInicialSerializer
from .permissions import IsAdministrador, IsOwnerOrAdmin
from drf_spectacular.utils import extend_schema

class AuthViewSet(viewsets.ViewSet):

    @extend_schema(
        description="""**🔓 PÚBLICO** - Iniciar sesión en el sistema
        
        Autentica a un usuario y retorna un token de acceso válido por 24 horas.
        """
    )
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)

            response_data = {
                'token': token.key,
                'user': UsuarioSerializer(user).data,
                'message': 'Inicio de sesión exitoso',
                'requiere_configuracion_inicial': not user.configuracion_inicial_completada
            }

            return Response(response_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        description="""**🔓 PÚBLICO** - Registrar contraseña inicial
        
        Permite a un usuario registrar su contraseña por primera vez en el sistema.
        Útil para usuarios creados por administradores que necesitan establecer su contraseña.
        """
    )
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
    
    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Listar todos los usuarios
        
        Retorna la lista completa de usuarios registrados en el sistema.
        Incluye tanto administradores como becarios.
        
        """
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Crear nuevo usuario
        
        Permite a un administrador crear un nuevo usuario en el sistema.
        Puede crear tanto administradores como becarios.
        
        """
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @extend_schema(
        description="""**🔐 BECARIOS Y ADMINISTRADORES** - Obtener usuario por ID
        
        Retorna los detalles de un usuario específico.
        
        **Permisos:**
        - **Administradores:** Pueden ver cualquier usuario
        - **Becarios:** Solo pueden ver su propio perfil
        """
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Actualizar usuario completo

        Actualiza todos los campos de un usuario existente.

        """
    )
    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except IntegrityError as e:
            if 'username' in str(e).lower():
                return Response(
                    {'username': ['Ya existe un usuario con este nombre de usuario.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'email' in str(e).lower():
                return Response(
                    {'email': ['Ya existe un usuario con este correo electrónico.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {'error': 'Error de integridad en la base de datos'},
                    status=status.HTTP_400_BAD_REQUEST
                )

    @extend_schema(
        description="""**👑 SOLO ADMINISTRADORES** - Actualización parcial de usuario

        Actualiza solo los campos especificados de un usuario existente.

        """
    )
    def partial_update(self, request, *args, **kwargs):
        try:
            return super().partial_update(request, *args, **kwargs)
        except IntegrityError as e:
            if 'username' in str(e).lower():
                return Response(
                    {'username': ['Ya existe un usuario con este nombre de usuario.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'email' in str(e).lower():
                return Response(
                    {'email': ['Ya existe un usuario con este correo electrónico.']},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {'error': 'Error de integridad en la base de datos'},
                    status=status.HTTP_400_BAD_REQUEST
                )

    @extend_schema(
        description="**👑 SOLO ADMINISTRADORES** - Eliminar usuario"
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
    @extend_schema(
        description="""**🔐 TODOS LOS USUARIOS AUTENTICADOS** - Ver mi perfil
        
         Retorna la información del perfil del usuario actualmente autenticado.
        Incluye las actividades asignadas si el usuario es becario."""
    )
    @action(detail=False, methods=['get'])
    def mi_perfil(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        description="**👑 SOLO ADMINISTRADORES** - Asignar actividades a becario"   
    )
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

    @extend_schema(
        description="""Configuración inicial del usuario (primer inicio de sesión)
        Permite a un usuario configurar su contraseña y pregunta de seguridad por primera vez."""
    )
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def configuracion_inicial(self, request):
        user = request.user

        # Check if initial setup is already completed
        if user.configuracion_inicial_completada:
            return Response(
                {'error': 'La configuración inicial ya ha sido completada'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ConfiguracionInicialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user)
            return Response({
                'message': 'Configuración inicial completada exitosamente',
                'user': UsuarioSerializer(user).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)