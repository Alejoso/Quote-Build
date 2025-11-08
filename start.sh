#!/bin/bash
# start.sh - Script para iniciar la aplicación completa

echo "🚀 Iniciando Quote&Build con Docker Compose..."

# Construir imágenes si no existen
if [[ "$(docker images -q quote-build-backend 2> /dev/null)" == "" ]]; then
    echo "📦 Construyendo Backend..."
    docker build -t quote-build-backend ./BackEnd
fi

if [[ "$(docker images -q quote-build-frontend 2> /dev/null)" == "" ]]; then
    echo "🎨 Construyendo Frontend..."
    docker build -t quote-build-frontend ./FrontEnd
fi

# Iniciar servicios
echo "▶️  Iniciando servicios..."
docker compose up -d

echo ""
echo "✅ Quote&Build iniciado exitosamente!"
echo ""
echo "🌐 Acceso a la aplicación:"
echo "   Frontend (Vite): http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Django Admin: http://localhost:8000/admin/"
echo ""
echo "📊 Para ver logs: docker compose logs -f"
echo "🛑 Para detener: docker compose down"