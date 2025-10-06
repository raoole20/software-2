from rest_framework import serializers
from .models import RegistroHoras
from activities.serializers import ActividadSerializer

class RegistroHorasSerializer(serializers.ModelSerializer):
    actividad_detalle = ActividadSerializer(source='actividad', read_only=True)
    becario_nombre = serializers.CharField(source='becario.get_full_name', read_only=True)
    
    class Meta:
        model = RegistroHoras
        fields = ['id', 'becario', 'becario_nombre', 'actividad', 'actividad_detalle',
                 'descripcion_manual', 'fecha_registro', 'horas_reportadas',
                 'estado_aprobacion', 'fecha_aprobacion', 'administrador_aprobo']

class RegistroHorasCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegistroHoras
        fields = ['actividad', 'descripcion_manual', 'horas_reportadas']
    
    def create(self, validated_data):
        validated_data['becario'] = self.context['request'].user
        return super().create(validated_data)

class AprobarRechazarSerializer(serializers.Serializer):
    accion = serializers.ChoiceField(choices=['aprobar', 'rechazar'])
    observaciones = serializers.CharField(required=False, allow_blank=True)