# 设置数据库环境变量的 PowerShell 脚本
# 使用方法: .\set-db-env.ps1

Write-Host "🔧 设置数据库环境变量..." -ForegroundColor Cyan

# 设置数据库连接
$env:DATABASE_URL = "postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"

Write-Host "✅ DATABASE_URL 已设置" -ForegroundColor Green
Write-Host ""
Write-Host "现在可以运行以下命令:" -ForegroundColor Yellow
Write-Host "  npm run dev              # 启动开发服务器" -ForegroundColor White
Write-Host "  npm run db:studio        # 打开数据库管理界面" -ForegroundColor White  
Write-Host "  npm run db:push          # 推送数据库更改" -ForegroundColor White
Write-Host "  npm run init:tarot       # 初始化塔罗牌数据" -ForegroundColor White
Write-Host ""
Write-Host "💡 提示: 这个环境变量只在当前 PowerShell 会话中有效" -ForegroundColor Cyan
Write-Host "   如果关闭窗口，需要重新运行此脚本" -ForegroundColor Cyan


