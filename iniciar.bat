@echo off
cd /d "%~dp0"
echo Actualizando el repositorio...
git pull

echo.
echo Iniciando Backend...
start "Backend Server" cmd /k "cd Backend && npm start"

echo.
echo Iniciando Frontend...
start "Frontend Client" cmd /k "cd Frontend && npm start -- --open"

echo.
echo Aplicacion iniciada.
pause
