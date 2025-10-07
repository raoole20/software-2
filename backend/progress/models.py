from django.db import models
from users.models import Usuario

class ProgresoMeta(models.Model):
    becario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    tipo_actividad = models.CharField(max_length=20)
    horas_objetivo = models.DecimalField(max_digits=5, decimal_places=2)
    horas_alcanzadas = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['becario', 'tipo_actividad']