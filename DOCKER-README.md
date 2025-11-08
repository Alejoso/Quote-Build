# 🐳 Quote&Build - Containerización con Docker

## Descripción

Esta guía explica cómo containerizar y ejecutar el proyecto Quote&Build usando Docker y Docker Compose.

## 📁 Estructura de Archivos Docker

```
Quote-Build/
├── docker-compose.yml          # Orquestación de servicios
├── .env                       # Variables de entorno
├── build.sh                   # Script para construir imágenes
├── start.sh                   # Script para iniciar aplicación
├── BackEnd/
│   ├── Dockerfile            # Imagen Docker para Django
│   ├── .dockerignore         # Archivos ignorados por Docker
│   └── requirements.txt      # Dependencias Python
├── FrontEnd/
│   ├── Dockerfile            # Imagen Docker para React
│   └── .dockerignore         # Archivos ignorados por Docker
```

## 🚀 Inicio Rápido

### Prerequisitos

- Docker instalado
- Docker Compose instalado

### Opción 1: Script Automático

```bash
# Ejecutar script de inicio (recomendado)
./start.sh
```

### Opción 2: Comandos Manuales

```bash
# 1. Construir imágenes
./build.sh

# 2. Iniciar servicios
docker-compose up -d

# 3. Ver logs
docker-compose logs -f
```

## 🌐 Acceso a la Aplicación

Una vez iniciado, podrás acceder a:

- **Frontend (React)**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Django Admin**: http://localhost:8000/admin/

## 🛠️ Comandos Útiles

### Gestión de Contenedores

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend
```

### Desarrollo

```bash
# Ejecutar comando en contenedor backend
docker-compose exec backend python manage.py shell

# Ejecutar migraciones
docker-compose exec backend python manage.py migrate

# Crear superusuario
docker-compose exec backend python manage.py createsuperuser

# Acceder al contenedor
docker-compose exec backend bash
docker-compose exec frontend sh
```

### Reconstruir Imágenes

```bash
# Reconstruir todas las imágenes
docker-compose build

# Reconstruir imagen específica
docker-compose build backend
docker-compose build frontend

# Forzar reconstrucción sin cache
docker-compose build --no-cache
```

## 🔧 Configuración

### Variables de Entorno (.env)

```bash
# Desarrollo
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend

# API URL para frontend
VITE_API_URL=http://localhost:8000

# Base de datos (opcional PostgreSQL)
# POSTGRES_DB=quote_build
# POSTGRES_USER=quote_user
# POSTGRES_PASSWORD=quote_pass
```

### Puertos Utilizados

- **3000**: Frontend (React + Vite)
- **8000**: Backend (Django)
- **5432**: PostgreSQL (opcional)

## 🗄️ Base de Datos

### SQLite (por defecto)

La base de datos SQLite se monta como volumen para persistir datos.

### PostgreSQL (opcional)

Para usar PostgreSQL, descomenta la sección `postgres` en `docker-compose.yml` y actualiza las variables de entorno.

## 🚦 Solución de Problemas

### Puerto en uso

Si los puertos están ocupados, modifica `docker-compose.yml`:

```yaml
ports:
  - "3001:80" # Frontend
  - "8001:8000" # Backend
```

### Problemas de permisos

```bash
# Cambiar permisos de la base de datos
chmod 666 BackEnd/quoteAndBuild/db.sqlite3
```

### Limpiar Docker

```bash
# Eliminar contenedores parados
docker container prune

# Eliminar imágenes no utilizadas
docker image prune

# Limpieza completa
docker system prune -a
```

## 🏗️ Arquitectura

### Backend (Django)

- **Base**: Python 3.12-slim
- **Puerto**: 8000
- **Servidor**: Django development server
- **Base de datos**: SQLite (montada como volumen)

### Frontend (React)

- **Base**: Node 20-alpine
- **Servidor**: Vite dev server
- **Puerto**: 5173 (mapeado a 3000)
- **Hot Reload**: Activado con volumes montados

### Red

Los servicios se comunican a través de una red Docker personalizada `quote-build-network`.

## 📝 Notas de Producción

Para producción, considera:

1. **Cambiar DEBUG=False** en variables de entorno
2. **Usar PostgreSQL** en lugar de SQLite
3. **Configurar HTTPS** con certificados SSL
4. **Usar secretos** para claves sensibles
5. **Implementar logging** estructurado
6. **Configurar backup** de base de datos

## 🤝 Contribución

Para contribuir al proyecto:

1. Realizar cambios en el código
2. Reconstruir imágenes: `docker-compose build`
3. Probar localmente: `docker-compose up`
4. Enviar pull request

---

💡 **Tip**: Usa `docker-compose logs -f` para monitorear la aplicación en tiempo real.
