# software-2

# Pasos para correr el Front

1. Abrir la carpeta del front

```
cd  Front
```

2. Instalar dependencias

```
npm install
```

3. Correr el front

```
npm run dev
```

# pasos para correr el back

Instrucciones y comandos para PowerShell (Windows):

1. Abrir PowerShell en la raíz del proyecto (donde está `.venv` y la carpeta `backend`).

2. Activar la virtualenv:

```powershell
.\.venv\Scripts\Activate.ps1
```

3. (Opcional) Instalar dependencias necesarias si aún no están instaladas:

```powershell
# instala dependencias principales
python -m pip install -r requirements.txt
# o instala paquetes sueltos
python -m pip install django-cors-headers djangorestframework
```

4. Correr el backend (desde la raíz del proyecto):

```powershell
python backend/manage.py runserver
```

5. Generar (freeze) las dependencias actuales en `requirements.txt`:

```powershell
# desde la virtualenv activada
python -m pip freeze > requirements.txt
```

Si no quieres activar la venv puedes usar el ejecutable absoluto del python de la venv:

```powershell
C:/Users/raool/OneDrive/Documentos/own_proyect/software/.venv/Scripts/python.exe backend/manage.py runserver
```

Notas:

- Asegúrate de ejecutar los comandos con la virtualenv activa para que Django use las dependencias instaladas en esa venv.
- Si PowerShell bloquea la activación por la política de ejecución, puedes permitir scripts para el usuario actual:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Documentación OpenAPI / Swagger

Una vez que tengas el servidor corriendo puedes acceder a la documentación automática generada por drf-spectacular:

```text
http://127.0.0.1:8000/api/schema/            # OpenAPI JSON
http://127.0.0.1:8000/api/schema/swagger-ui/ # Swagger UI interactivo
http://127.0.0.1:8000/api/schema/redoc/      # ReDoc UI
```

Si necesitas personalizar o documentar mejor endpoints, puedes usar:

- `@extend_schema(...)` en vistas o viewsets (drf-spectacular utilities) para describir request/response, parámetros y ejemplos.
- Documentar serializers con `help_text` y `example` para que aparezca en el esquema generado.

1. cd ./backend
2. python manage.py runserver

### Datos del superusuario
```
{
  "email": "cristobal26r@gmail.com",
  "password": "31135242c"
}
```

## Crear / recrear las tablas (migraciones)

Si las tablas de la base de datos SQLite no existen o quieres recrearlas, sigue estos pasos desde PowerShell en la raíz del proyecto.

1. Activa la virtualenv (si no está activa):

```powershell
.\.venv\Scripts\Activate.ps1
```

2. Genera migraciones (si hiciste cambios en modelos):

```powershell
# Crea/actualiza los archivos de migración para las apps que cambiaron
python backend/manage.py makemigrations
```

3. Aplica las migraciones para crear las tablas en `backend/db.sqlite3`:

```powershell
python backend/manage.py migrate
```

4. Verifica qué migraciones están aplicadas:

```powershell
python backend/manage.py showmigrations
```

5. (Opcional, destruye y recrea la base de datos) — ADVERTENCIA: esto borra todos los datos:

```powershell
# Elimina el archivo sqlite y vuelve a aplicar migraciones limpias
Remove-Item .\backend\db.sqlite3 -Force
python backend/manage.py migrate
```

6. Cargar datos de ejemplo (seed)

Si usas el comando `seed_users` incluido en este proyecto, ejecútalo después de aplicar las migraciones:

```powershell
python backend/manage.py seed_users
# Para actualizar usuarios existentes
python backend/manage.py seed_users --update
# Para usar otro archivo CSV
python backend/manage.py seed_users --file path\to\file.csv
```

7. Problemas comunes

- Si `migrate` falla, ejecuta con `--traceback` para ver la traza completa:

```powershell
python backend/manage.py migrate --traceback
```

- Si el editor muestra import errors (p. ej. `Import "django..." could not be resolved`), asegúrate de que VS Code está usando la misma Python/venv que activas en PowerShell.
- Si alguna app en `INSTALLED_APPS` lanza excepciones al importarse, corrige esas excepciones primero (revisa `apps.py` y `models.py`).

Haz una copia de seguridad del archivo `backend/db.sqlite3` antes de eliminarlo si necesitas conservar los datos.
