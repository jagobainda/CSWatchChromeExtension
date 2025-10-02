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

set "EXCLUDE_DIRS="
set "EXCLUDE_FILES="

for /f "usebackq tokens=* delims=" %%i in (".buildignore") do (
    set "line=%%i"
    call :processLine
)

robocopy . "temp_build" /E %EXCLUDE_DIRS% %EXCLUDE_FILES%

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
exit /b

:processLine

set "line=%line:~0,1024%"
if "%line%"=="" exit /b
if "%line:~0,1%"=="#" exit /b


if "%line:~-1%"=="/" (
    set "EXCLUDE_DIRS=%EXCLUDE_DIRS% /XD %line:~0,-1%"
    exit /b
)


echo %line% | findstr /C:"*" >nul
if not errorlevel 1 (
    set "EXCLUDE_FILES=%EXCLUDE_FILES% /XF %line%"
    exit /b
)


set "EXCLUDE_FILES=%EXCLUDE_FILES% /XF %line%"
exit /b