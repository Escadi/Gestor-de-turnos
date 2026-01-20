@echo off
echo Actualizando el repositorio...
git pull

echo Iniciando Backend...
start cmd /k "cd Backend && npm start"

echo Iniciando Frontend...
start cmd /k "cd Frontend && npm start -- --open"

echo Aplicacion iniciada.
pause
