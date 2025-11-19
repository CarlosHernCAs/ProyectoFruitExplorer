@echo off
echo ========================================
echo   Reiniciando Servidor Backend
echo ========================================
echo.

echo [1] Deteniendo servidor en puerto 4000...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :4000 ^| findstr LISTENING') DO (
    echo    Matando proceso %%P
    taskkill /F /PID %%P >nul 2>&1
)

echo [2] Esperando 2 segundos...
timeout /t 2 /nobreak >nul

echo [3] Iniciando servidor...
start "FruitExplorer Backend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Servidor reiniciado exitosamente!
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
