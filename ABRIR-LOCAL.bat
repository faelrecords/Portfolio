@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale o Node.js 22 antes de continuar.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias...
  call npm install
  if errorlevel 1 goto :error
)
call npm run dev
exit /b 0
:error
echo.
echo Nao foi possivel iniciar o projeto.
pause
exit /b 1
