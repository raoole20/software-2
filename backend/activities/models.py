from django.db import models
from users.models import Usuario

class Actividad(models.Model):
    TIPO_CHOICES = [
        ('Interna', 'Voluntariado Interno'),
        ('Externa', 'Voluntariado Externo'),
        ('Taller', 'Taller'),
        ('Chat', 'Chat de Inglés'),
    ]
    
    MODALIDAD_CHOICES = [
        ('P', 'Presencial'),
        ('V', 'Virtual'),
    ]
    
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    fecha = models.DateField()
    duracion_horas = models.DecimalField(max_digits=5, decimal_places=2)
    competencia_desarrollada = models.CharField(max_length=100, blank=True)
    modalidad = models.CharField(max_length=1, choices=MODALIDAD_CHOICES)
    organizacion = models.CharField(max_length=100, blank=True)
    facilitador = models.CharField(max_length=100, blank=True)
    creador = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='actividades_creadas')
    en_catalogo = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo