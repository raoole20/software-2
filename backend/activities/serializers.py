from rest_framework import serializers
from .models import Actividad

class ActividadSerializer(serializers.ModelSerializer):
    creador_nombre = serializers.CharField(source='creador.get_full_name', read_only=True)
    
    class Meta:
        model = Actividad
        fields = ['id', 'titulo', 'descripcion', 'tipo', 'fecha', 'duracion_horas',
                 'competencia_desarrollada', 'modalidad', 'organizacion', 'facilitador',
                 'creador', 'creador_nombre', 'en_catalogo', 'fecha_creacion']

class ActividadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actividad
        fields = ['titulo', 'descripcion', 'tipo', 'fecha', 'duracion_horas',
                 'competencia_desarrollada', 'modalidad', 'organizacion', 'facilitador']