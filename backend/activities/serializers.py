from rest_framework import serializers
from .models import Actividad
from users.serializers import UsuarioSerializer

# NUEVO: Serializer básico para evitar recursividad
class ActividadBasicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['id', 'titulo', 'tipo', 'fecha', 'duracion_horas', 'modalidad']

class ActividadSerializer(serializers.ModelSerializer):
    creador_nombre = serializers.CharField(source='creador.get_full_name', read_only=True)
    # NUEVO: Mostrar becarios asignados con sus datos
    becarios_asignados_info = UsuarioSerializer(
        source='becarios_asignados', 
        many=True, 
        read_only=True
    )
    
    class Meta:
        model = Actividad
        fields = ['id', 'titulo', 'descripcion', 'tipo', 'fecha', 'duracion_horas',
                 'competencia_desarrollada', 'modalidad', 'organizacion', 'facilitador',
                 'creador', 'creador_nombre', 'en_catalogo', 'fecha_creacion',
                 'becarios_asignados', 'becarios_asignados_info']  # NUEVOS campos

class ActividadCreateSerializer(serializers.ModelSerializer):
    becarios_asignados = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        write_only=True,
        help_text="Lista de IDs de becarios a asignar a la actividad"
    )

    class Meta:
        model = Actividad
        fields = ['titulo', 'descripcion', 'tipo', 'fecha', 'duracion_horas',
                 'competencia_desarrollada', 'modalidad', 'organizacion', 'facilitador',
                 'en_catalogo', 'becarios_asignados']

    def create(self, validated_data):
        becarios_ids = validated_data.pop('becarios_asignados', [])
        actividad = super().create(validated_data)

        if becarios_ids:
            from users.models import Usuario
            becarios = Usuario.objects.filter(id__in=becarios_ids, rol='becario')
            actividad.becarios_asignados.set(becarios)

        return actividad

# NUEVO: Serializer específico para asignar becarios
class AsignarBecariosSerializer(serializers.Serializer):
    becarios_ids = serializers.ListField(
        child=serializers.IntegerField(),
        help_text="Lista de IDs de becarios a asignar"
    )