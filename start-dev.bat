@echo off
chcp 65001 >nul
REM DiuDiu Tarot 开发服务器启动脚本

cd /d "%~dp0"

echo ========================================
echo 🔮 DiuDiu Tarot 开发服务器启动中...
echo ========================================
echo.
echo 📁 当前目录: %CD%
echo 🌐 服务器地址: http://localhost:3000
echo.
echo 提示: 按 Ctrl+C 停止服务器
echo.

pnpm dev
pause

