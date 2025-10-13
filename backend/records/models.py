from django.db import models
from users.models import Usuario
from activities.models import Actividad

class RegistroHoras(models.Model):
    ESTADO_CHOICES = [
        ('P', 'Pendiente'),
        ('A', 'Aprobado'),
        ('R', 'Rechazado'),
    ]
    
    becario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='registros_horas')
    actividad = models.ForeignKey(Actividad, on_delete=models.CASCADE)
    descripcion_manual = models.TextField(blank=True)
    fecha_registro = models.DateField(auto_now_add=True)
    horas_reportadas = models.DecimalField(max_digits=5, decimal_places=2)
    estado_aprobacion = models.CharField(max_length=1, choices=ESTADO_CHOICES, default='P')
    fecha_aprobacion = models.DateTimeField(null=True, blank=True)
    administrador_aprobo = models.ForeignKey(Usuario, on_delete=models.SET_NULL, 
                                           null=True, blank=True, related_name='registros_aprobados')

    def __str__(self):
        return f"{self.becario.get_full_name()} - {self.actividad.titulo} - {self.horas_reportadas}h"