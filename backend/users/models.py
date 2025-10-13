from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROL_CHOICES = [
        ('becario', 'Becario'),
        ('administrador', 'Administrador'),
    ]
    
    SEXO_CHOICES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
    ]
    
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='becario')
    sexo = models.CharField(max_length=1, choices=SEXO_CHOICES, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    carrera = models.CharField(max_length=100, blank=True)
    universidad = models.CharField(max_length=100, blank=True)
    semestre = models.CharField(max_length=50, blank=True)
    meta_horas_voluntariado_interno = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    meta_horas_voluntariado_externo = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    meta_horas_chat_ingles = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    meta_horas_talleres = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.rol})"