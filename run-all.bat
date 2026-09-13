@echo off
start "FixMyCampus Backend" cmd /k "cd /d %~dp0backend && mvnw.cmd spring-boot:run"
timeout /t 4 /nobreak >nul
start "FixMyCampus Frontend" cmd /k "cd /d %~dp0frontend && if not exist node_modules npm install && npm run dev"
echo Starting backend and frontend in separate windows.
