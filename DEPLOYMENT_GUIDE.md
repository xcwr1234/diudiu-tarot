# 🚀 DiuDiu Tarot 部署指南

## 📋 部署前检查清单

### ✅ 已完成
- [x] 移除所有付费功能
- [x] 配置 DeepSeek API
- [x] 更新法律协议
- [x] 修复所有构建错误
- [x] 项目可以成功构建

### 🔄 需要完成
- [ ] 配置生产环境数据库
- [ ] 设置环境变量
- [ ] 部署到 Vercel
- [ ] 配置域名（可选）

## 🚀 Vercel 部署步骤

### 1. 登录 Vercel
```bash
vercel login
```

### 2. 部署项目
```bash
vercel --prod
```

### 3. 配置环境变量
在 Vercel 控制台中设置以下环境变量：

#### 必需的环境变量：
```
DATABASE_URL=postgresql://username:password@host:port/database
AUTH_SECRET=your-super-secret-auth-key-here
NEXTAUTH_URL=https://your-domain.vercel.app
DEEPSEEK_API_KEY=sk-e0c6b1b40ba5497bb77ac3f4f75edf9e
```

#### 可选的环境变量：
```
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🗄️ 数据库配置

### 选项 1: Supabase (推荐)
1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目
3. 获取数据库连接字符串
4. 在 Vercel 中设置 `DATABASE_URL`

### 选项 2: Vercel Postgres
1. 在 Vercel 控制台创建 Postgres 数据库
2. 自动获取 `DATABASE_URL`

### 选项 3: 其他数据库
- PlanetScale
- Neon
- Railway

## 🔐 安全配置

### 生成强密码 AUTH_SECRET
```bash
openssl rand -base64 32
```

### 配置 CORS（如需要）
在 `next.config.mjs` 中添加：
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

## 📊 SEO 优化

### 1. Google Analytics
1. 创建 Google Analytics 账户
2. 获取 GA4 测量 ID
3. 设置环境变量 `NEXT_PUBLIC_GA_ID`

### 2. 站点地图
项目已包含 `sitemap.xml` 和 `robots.txt`

## 🌐 域名配置

### 1. 自定义域名
1. 在 Vercel 控制台添加域名
2. 配置 DNS 记录
3. 更新 `NEXTAUTH_URL` 环境变量

### 2. SSL 证书
Vercel 自动提供 SSL 证书

## 🔧 故障排除

### 常见问题：
1. **构建失败**: 检查所有依赖是否正确安装
2. **数据库连接失败**: 验证 `DATABASE_URL` 格式
3. **API 调用失败**: 检查 `DEEPSEEK_API_KEY` 是否正确
4. **认证失败**: 验证 `AUTH_SECRET` 是否设置

### 调试命令：
```bash
# 本地测试
pnpm dev

# 构建测试
pnpm build

# 检查环境变量
vercel env ls
```

## 📞 支持

如果遇到问题，请检查：
1. Vercel 部署日志
2. 环境变量配置
3. 数据库连接状态
4. API 密钥有效性

---

**部署完成后，你的 DiuDiu Tarot 网站就可以正式上线了！** 🎉
