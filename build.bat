@echo off
echo Building Chrome extension...

for /f "tokens=2 delims=:" %%a in ('findstr "version" manifest.json') do (
    set version_line=%%a
)
for /f "tokens=1 delims=," %%a in ("%version_line%") do (
    set version=%%a
)
set version=%version:"=%
set version=%version: =%
echo Extension version: %version%

if exist "temp_build" rmdir /s /q "temp_build"
mkdir "temp_build"

robocopy . "temp_build" /E /XD .git temp_build .vscode .idea /XF .gitignore README.md LICENSE build.bat .buildignore *.zip *.log .DS_Store

set zipName=cswatch-chrome-extension-%version%.zip
echo Creating: %zipName%

if exist "%zipName%" (
    echo Removing existing %zipName%...
    del /f "%zipName%" 2>nul
    timeout /t 1 /nobreak >nul
)

powershell "Compress-Archive -Path 'temp_build\*' -DestinationPath '%zipName%' -Force"

rmdir /s /q "temp_build"

echo Extension built successfully: %zipName%
pause