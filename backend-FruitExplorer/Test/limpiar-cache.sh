#!/bin/bash
# Script para limpiar caché de Vite y resolver problemas de módulos
# Ejecutar: ./limpiar-cache.sh

echo "🧹 Limpiando caché de Vite..."

# Verificar si estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la carpeta frontend-Web"
    exit 1
fi

# Detener procesos de Vite si están corriendo
echo "⏹️  Deteniendo procesos de Vite..."
pkill -f "vite" 2>/dev/null || true

# Limpiar caché de Vite en node_modules
if [ -d "node_modules/.vite" ]; then
    echo "🗑️  Eliminando node_modules/.vite..."
    rm -rf node_modules/.vite
    echo "✅ Caché de node_modules limpiado"
fi

# Limpiar caché de Vite en raíz
if [ -d ".vite" ]; then
    echo "🗑️  Eliminando .vite..."
    rm -rf .vite
    echo "✅ Caché de raíz limpiado"
fi

# Limpiar dist
if [ -d "dist" ]; then
    echo "🗑️  Eliminando dist..."
    rm -rf dist
    echo "✅ Build antiguo limpiado"
fi

echo ""
echo "✅ ¡Caché limpiado exitosamente!"
echo ""
echo "📝 Pasos siguientes:"
echo "1. Ejecutar: npm run dev"
echo "2. Abrir navegador en: http://localhost:5173"
echo "3. Hacer hard refresh: Ctrl + Shift + R (Linux) o Cmd + Shift + R (Mac)"
echo ""
echo "🎉 El error 'exportRegions not found' debería estar resuelto"
