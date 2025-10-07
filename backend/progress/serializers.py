from rest_framework import serializers
from users.serializers import UsuarioSerializer

class ProgresoMetaSerializer(serializers.Serializer):
    tipo_actividad = serializers.CharField()
    horas_objetivo = serializers.DecimalField(max_digits=5, decimal_places=2)
    horas_alcanzadas = serializers.DecimalField(max_digits=5, decimal_places=2)
    porcentaje = serializers.DecimalField(max_digits=5, decimal_places=2)
    horas_restantes = serializers.DecimalField(max_digits=5, decimal_places=2)

class ProgresoGeneralSerializer(serializers.Serializer):
    becario = UsuarioSerializer()
    horas_totales_aprobadas = serializers.DecimalField(max_digits=5, decimal_places=2)
    meta_total = serializers.DecimalField(max_digits=5, decimal_places=2)
    porcentaje_cumplimiento = serializers.DecimalField(max_digits=5, decimal_places=2)