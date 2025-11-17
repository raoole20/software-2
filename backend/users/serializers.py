from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Usuario

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if email and password:
            try:
                # Buscar el usuario por email
                usuario_obj = Usuario.objects.get(email=email)
                # Usar el username para autenticar
                user = authenticate(username=usuario_obj.username, password=password)
                if not user:
                    raise serializers.ValidationError('Credenciales inválidas')
                data['user'] = user
            except Usuario.DoesNotExist:
                raise serializers.ValidationError('Credenciales inválidas')
        return data

class UsuarioSerializer(serializers.ModelSerializer):
    # NUEVO: Mostrar actividades asignadas al becario
    actividades_asignadas = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'rol', 
                 'sexo', 'fecha_nacimiento', 'carrera', 'universidad', 'semestre',
                 'meta_horas_voluntariado_interno', 'meta_horas_voluntariado_externo',
                 'meta_horas_chat_ingles', 'meta_horas_talleres',
                 'actividades_asignadas']  # NUEVO campo
        extra_kwargs = {'password': {'write_only': True}}

    def get_actividades_asignadas(self, obj):
        """Obtener información básica de las actividades asignadas al becario"""
        if obj.rol != 'becario':
            return []
        
        from activities.serializers import ActividadBasicaSerializer
        actividades = obj.actividades_asignadas.all()
        return ActividadBasicaSerializer(actividades, many=True).data

class UsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'rol',
                 'sexo', 'fecha_nacimiento', 'carrera', 'universidad', 'semestre',
                 'meta_horas_voluntariado_interno', 'meta_horas_voluntariado_externo',
                 'meta_horas_chat_ingles', 'meta_horas_talleres']

    def validate_username(self, value):
        if Usuario.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        return value

    def validate_email(self, value):
        if Usuario.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este correo electrónico.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Usuario(**validated_data)
        user.set_password(password)
        user.save()
        return user