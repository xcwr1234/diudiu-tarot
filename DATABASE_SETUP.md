# 🗄️ 数据库配置说明

## ✅ 数据库已成功初始化

您的 PostgreSQL 数据库已经成功配置并初始化！

### 📊 数据库信息

- **数据库类型**: PostgreSQL (Supabase)
- **主机**: db.pgqatqfkogojfgzkngsw.supabase.co
- **端口**: 5432
- **数据库名**: postgres
- **连接字符串**: `postgresql://postgres:[密码]@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres`

### 🗂️ 已创建的数据表

以下表已成功创建：

1. **users** - 用户表
   - 存储用户基本信息、登录信息
   - 支持邀请码系统
   - 联盟营销功能

2. **orders** - 订单表
   - 存储支付订单
   - 支持 Stripe 支付集成
   - 订阅和一次性付款

3. **credits** - 积分表
   - 用户积分充值记录
   - 积分消费记录
   - 过期时间管理

4. **apikeys** - API密钥表
   - 用户 API 密钥管理
   - 用于外部调用

5. **posts** - 文章表
   - 博客文章存储
   - 多语言支持

6. **affiliates** - 联盟营销表
   - 推荐关系追踪
   - 佣金计算

7. **feedbacks** - 反馈表
   - 用户反馈收集
   - 评分系统

8. **tarot_readings** - 塔罗占卜记录表
   - 用户占卜历史
   - 牌阵和解读存储

9. **tarot_cards** - 塔罗牌参考表
   - 塔罗牌基础数据
   - 4种牌组（Marseille, Golden Dawn, Waite, Thoth）
   - 大阿卡纳（22张）+ 小阿卡纳（示例卡片）

### 🎴 已初始化的塔罗牌数据

成功初始化了以下塔罗牌数据：

- ✅ **Marseille Deck** (马赛塔罗)
- ✅ **Golden Dawn Deck** (金色黎明塔罗) 
- ✅ **Waite Deck** (伟特塔罗)
- ✅ **Thoth Deck** (托特塔罗)

每个牌组包含：
- 22张大阿卡纳牌（The Fool - The World）
- 示例小阿卡纳牌（权杖、圣杯、宝剑、星币各3张）

### 🔧 环境配置

**重要**: 由于 `.env.local` 文件被 Git 忽略，您需要手动创建该文件。

创建 `shipany-template-one-main/.env.local` 文件并添加：

```env
# 数据库配置
DATABASE_URL=postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres

# 认证配置
AUTH_SECRET=your-random-secret-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000

# Stripe 支付配置（可选）
# STRIPE_PUBLIC_KEY=pk_test_your_key
# STRIPE_PRIVATE_KEY=sk_test_your_key
# STRIPE_WEBHOOK_SECRET=whsec_your_secret

# DeepSeek AI 配置（可选）
# DEEPSEEK_API_KEY=your_api_key
```

### 🚀 使用方法

#### 1. 启动开发服务器

```bash
cd shipany-template-one-main
pnpm dev
```

#### 2. 查看数据库（Drizzle Studio）

```bash
# 在 PowerShell 中运行
$env:DATABASE_URL="postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"
npx drizzle-kit studio --config=src/db/config.ts
```

然后访问: http://localhost:4983

#### 3. 推送数据库更改

如果修改了 schema.ts，运行：

```bash
$env:DATABASE_URL="postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"
npx drizzle-kit push --config=src/db/config.ts
```

#### 4. 生成迁移文件

```bash
$env:DATABASE_URL="postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"
npx drizzle-kit generate --config=src/db/config.ts
```

### 📝 npm 脚本

在 `package.json` 中已配置的数据库脚本：

```json
{
  "db:generate": "npx drizzle-kit generate --config=src/db/config.ts",
  "db:migrate": "npx drizzle-kit migrate --config=src/db/config.ts",
  "db:studio": "npx drizzle-kit studio --config=src/db/config.ts",
  "db:push": "npx drizzle-kit push --config=src/db/config.ts",
  "init:tarot": "tsx src/scripts/init-tarot-data.ts"
}
```

**注意**: 在 Windows PowerShell 中使用这些脚本前，需要先设置环境变量：

```powershell
$env:DATABASE_URL="postgresql://postgres:Ztq783593@@db.pgqatqfkogojfgzkngsw.supabase.co:5432/postgres"
```

### 🔒 安全提示

1. **密码保护**: 数据库密码已包含在连接字符串中，请勿将 `.env.local` 文件提交到 Git
2. **生产环境**: 生产环境请使用更强的密码和 SSL 连接
3. **AUTH_SECRET**: 请更改为随机生成的密钥（至少32字符）

生成随机密钥：
```bash
openssl rand -base64 32
```

### ✅ 验证清单

- [x] 数据库连接成功
- [x] 所有数据表已创建
- [x] 塔罗牌数据已初始化（4个牌组 x 34张卡片 = 136条记录）
- [x] Drizzle ORM 配置完成
- [ ] 创建 .env.local 文件
- [ ] 配置 AUTH_SECRET
- [ ] （可选）配置 Stripe 支付
- [ ] （可选）配置 DeepSeek AI

### 🆘 故障排除

**问题1: 数据库连接失败**
- 检查网络连接
- 确认 Supabase 项目状态
- 验证密码是否正确

**问题2: 环境变量未生效**
- 确认已创建 `.env.local` 文件
- 重启开发服务器
- 在 PowerShell 中手动设置: `$env:DATABASE_URL="..."`

**问题3: 迁移失败**
- 检查数据库权限
- 确认 schema 语法正确
- 查看详细错误日志

### 📚 相关文档

- [Drizzle ORM 文档](https://orm.drizzle.team/)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [支付功能配置](./PAYMENT_SETUP.md)

---

**数据库初始化完成！现在可以开始使用 DiuDiu Tarot 了！** 🎉🔮


