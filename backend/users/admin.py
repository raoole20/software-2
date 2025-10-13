from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario

# Registrar el modelo Usuario en el admin
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Campos que se mostrarán en la lista de usuarios
    list_display = ['username', 'email', 'first_name', 'last_name', 'rol', 'is_staff']
    
    # Campos por los que se puede filtrar
    list_filter = ['rol', 'is_staff', 'is_superuser']
    
    # Campos para búsqueda
    search_fields = ['username', 'email', 'first_name', 'last_name']
    
    # Ordenamiento
    ordering = ['username']
    
    # Camposets para el formulario de edición
    fieldsets = UserAdmin.fieldsets + (
        ('Información AVAA', {
            'fields': ('rol', 'sexo', 'fecha_nacimiento', 'carrera', 
                      'universidad', 'semestre', 'meta_horas_voluntariado_interno',
                      'meta_horas_voluntariado_externo', 'meta_horas_chat_ingles',
                      'meta_horas_talleres')
        }),
    )
