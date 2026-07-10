@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules call npm install
call npm run lint || goto :error
call npm run validate:content || goto :error
call npm run build || goto :error
echo.
echo Projeto validado. A pasta dist esta pronta.
pause
exit /b 0
:error
echo.
echo A validacao encontrou um erro.
pause
exit /b 1
