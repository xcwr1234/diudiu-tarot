# DiuDiu Tarot 开发服务器启动脚本
# 自动切换到正确的目录并启动开发服务器

# 获取脚本所在目录
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 切换到项目目录
Set-Location $ScriptDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔮 DiuDiu Tarot 开发服务器启动中..." -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📁 当前目录: $ScriptDir" -ForegroundColor Green
Write-Host "🌐 服务器地址: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "提示: 按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

# 启动开发服务器
pnpm dev

