@echo off
cd /d "%~dp0"
echo.
echo  Healing Angels — local server
echo  Open:  http://127.0.0.1:8000/
echo  Press Ctrl+C to stop.
echo.
start "" "http://127.0.0.1:8000/"
python -m http.server 8000
