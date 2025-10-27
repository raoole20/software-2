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