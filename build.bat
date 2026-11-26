@echo off
setlocal
cd /d "%~dp0"
echo Building Counter-Strike Stats Extension...

for /f "tokens=2 delims=:" %%a in ('findstr /C:"\"version\":" manifest.json') do set version=%%a
set version=%version:"=%
set version=%version: =%
set version=%version:,=%
echo Extension version: %version%

if exist "temp_build" rmdir /s /q "temp_build"
mkdir "temp_build"

set "EXCLUDE_DIRS="
set "EXCLUDE_FILES="

for /f "usebackq tokens=* delims=" %%i in (".buildignore") do (
    set "line=%%i"
    call :processLine
)

robocopy . "temp_build" /E /NFL /NDL /NJH /NJS %EXCLUDE_DIRS% %EXCLUDE_FILES% >nul

set "zipName=counter-strike-stats-extension-%version%.zip"
echo Creating: %zipName%

if exist "%zipName%" del /f "%zipName%"

tar -a -c -f "%zipName%" -C "temp_build" *
set "tarResult=%errorlevel%"

rmdir /s /q "temp_build"

if not "%tarResult%"=="0" (
    echo Build failed.
    exit /b 1
)

echo Extension built successfully: %zipName%

echo %cmdcmdline% | findstr /I /C:"%~f0" >nul && pause
exit /b 0

:processLine

if "%line%"=="" exit /b
if "%line:~0,1%"=="#" exit /b

if "%line:~-1%"=="/" (
    set "EXCLUDE_DIRS=%EXCLUDE_DIRS% /XD %line:~0,-1%"
    exit /b
)

set "EXCLUDE_FILES=%EXCLUDE_FILES% /XF %line%"
exit /b
