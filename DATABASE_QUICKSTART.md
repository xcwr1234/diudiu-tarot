# 🚀 数据库快速开始指南

## ✅ 数据库已初始化完成！

您的 PostgreSQL 数据库（Supabase）已成功配置并初始化。

### 📋 快速使用步骤

#### 方法 1: 使用 PowerShell 脚本（推荐）

```powershell
# 1. 在 PowerShell 中进入项目目录
cd shipany-template-one-main

# 2. 运行设置脚本（设置环境变量）
.\set-db-env.ps1

# 3. 启动开发服务器
pnpm dev
```

#### 方法 2: 手动设置（每次都需要）

```powershell
# 设置环境变量
$env:DATABASE_URL="postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"

# 启动开发服务器
pnpm dev
```

#### 方法 3: 创建 .env.local 文件（一劳永逸）

1. 在 `shipany-template-one-main` 目录下创建 `.env.local` 文件
2. 添加以下内容：

```env
DATABASE_URL=postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres
AUTH_SECRET=your-random-secret-key-32-characters-long
NEXTAUTH_URL=http://localhost:3000
```

3. 直接运行 `pnpm dev` 即可

### 🎯 验证数据库

访问 Drizzle Studio 查看数据库：

```powershell
# 运行设置脚本
.\set-db-env.ps1

# 启动数据库管理界面
npm run db:studio
```

然后在浏览器访问: **http://localhost:4983**

### 📊 已创建的内容

- ✅ 9个数据表（users, orders, credits, apikeys, posts, affiliates, feedbacks, tarot_readings, tarot_cards）
- ✅ 136条塔罗牌数据（4个牌组 x 34张卡片）
- ✅ 完整的支付系统表结构
- ✅ 用户认证和积分系统

### 🔧 常用命令

```powershell
# 设置环境变量（需要先运行）
.\set-db-env.ps1

# 启动开发服务器
pnpm dev

# 查看数据库
npm run db:studio

# 推送数据库更改（修改 schema 后）
npm run db:push

# 重新初始化塔罗牌数据
npm run init:tarot
```

### 📚 详细文档

- 📖 [完整数据库配置文档](./DATABASE_SETUP.md)
- 💳 [支付功能配置](./PAYMENT_SETUP.md)
- 🚀 [支付功能快速开始](./PAYMENT_QUICKSTART.md)

### 🎉 下一步

1. ✅ 数据库已就绪
2. 💳 查看支付功能: 访问 `/pricing`
3. 🔮 开始塔罗占卜功能开发
4. 🎨 自定义界面和功能

---

**一切准备就绪！开始您的 DiuDiu Tarot 之旅吧！** 🔮✨

有问题？查看 [DATABASE_SETUP.md](./DATABASE_SETUP.md) 获取更多帮助。


