# Script para limpiar caché de Vite y resolver problemas de módulos
# Ejecutar: .\limpiar-cache.ps1

Write-Host "🧹 Limpiando caché de Vite..." -ForegroundColor Cyan

# Verificar si estamos en el directorio correcto
if (-Not (Test-Path "package.json")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la carpeta frontend-Web" -ForegroundColor Red
    exit 1
}

# Detener procesos de Vite si están corriendo
Write-Host "⏹️  Deteniendo procesos de Vite..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {$_.Path -like "*vite*"} | Stop-Process -Force

# Limpiar caché de Vite en node_modules
if (Test-Path "node_modules\.vite") {
    Write-Host "🗑️  Eliminando node_modules\.vite..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules\.vite"
    Write-Host "✅ Caché de node_modules limpiado" -ForegroundColor Green
}

# Limpiar caché de Vite en raíz
if (Test-Path ".vite") {
    Write-Host "🗑️  Eliminando .vite..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force ".vite"
    Write-Host "✅ Caché de raíz limpiado" -ForegroundColor Green
}

# Limpiar dist
if (Test-Path "dist") {
    Write-Host "🗑️  Eliminando dist..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "dist"
    Write-Host "✅ Build antiguo limpiado" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ ¡Caché limpiado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Pasos siguientes:" -ForegroundColor Cyan
Write-Host "1. Ejecutar: npm run dev" -ForegroundColor White
Write-Host "2. Abrir navegador en: http://localhost:5173" -ForegroundColor White
Write-Host "3. Hacer hard refresh: Ctrl + Shift + R" -ForegroundColor White
Write-Host ""
Write-Host "🎉 El error 'exportRegions not found' debería estar resuelto" -ForegroundColor Green
