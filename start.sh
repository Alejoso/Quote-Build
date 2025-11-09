#!/bin/bash
# start.sh - Script para iniciar la aplicación completa

echo "🚀 Iniciando Quote&Build con Docker Compose..."

# Construir imágenes si no existen

docker build -t quote-build-backend ./BackEnd



docker build -t quote-build-frontend ./FrontEnd


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