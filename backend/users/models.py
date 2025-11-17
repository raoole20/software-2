from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager

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

    # Security and initial setup fields
    pregunta_seguridad = models.CharField(max_length=255, blank=True, null=True)
    respuesta_seguridad = models.CharField(max_length=255, blank=True, null=True)  # Will be hashed
    configuracion_inicial_completada = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True, help_text="Desactivar en lugar de eliminar")


    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.rol})"
    
    # Use Django's UserManager so authentication helpers (authenticate/get_by_natural_key)
    # work correctly. Replacing with a plain models.Manager removes methods required
    # by the auth backend and causes the ``get_by_natural_key`` AttributeError.
    objects = UserManager()
    # active_objects can remain a simple manager or extend UserManager if you need
    # authentication-related helpers on that manager as well.
    active_objects = models.Manager()