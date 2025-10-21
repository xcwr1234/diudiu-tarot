# 💳 支付系统配置指南

本文档将指导您完成 DiuDiu Tarot 支付系统的配置。

## 📋 目录

- [Stripe 账户设置](#stripe-账户设置)
- [环境变量配置](#环境变量配置)
- [本地测试](#本地测试)
- [支付页面预览](#支付页面预览)
- [常见问题](#常见问题)

## 🎯 Stripe 账户设置

### 1. 注册 Stripe 账户

访问 [Stripe 官网](https://stripe.com) 注册账户。

### 2. 创建店铺

1. 登录 Stripe 后台
2. 点击左上角店铺名称，选择 "新建账户"
3. 填写店铺信息（名称、国家、业务类型等）

### 3. 获取 API 密钥

1. 进入 **开发者 → API 密钥** 页面
2. 复制以下密钥：
   - **Publishable key** (以 `pk_test_` 或 `pk_live_` 开头)
   - **Secret key** (以 `sk_test_` 或 `sk_live_` 开头)

⚠️ **注意**：
- 测试环境使用 `test` 密钥
- 生产环境使用 `live` 密钥
- **切勿**将密钥提交到 Git 仓库

### 4. 配置 Webhook

1. 进入 **开发者 → Webhooks** 页面
2. 点击 **添加端点**
3. 填写端点 URL：
   ```
   https://your-domain.com/api/stripe-notify
   ```
4. 选择监听事件：
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
5. 添加完成后，复制 **Signing secret** (以 `whsec_` 开头)

## ⚙️ 环境变量配置

### 开发环境

创建 `.env.development` 文件（或 `.env.local`）：

```env
# 网站配置
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_PROJECT_NAME=DiuDiu Tarot

# 支付配置
PAY_PROVIDER=stripe

# Stripe 测试密钥
STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxx
STRIPE_PRIVATE_KEY=sk_test_xxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx

# 支付回调 URL
NEXT_PUBLIC_PAY_SUCCESS_URL=/payment/success
NEXT_PUBLIC_PAY_FAIL_URL=/payment/failed
NEXT_PUBLIC_PAY_CANCEL_URL=/pricing

# 数据库配置
DATABASE_URL=your_database_url

# 认证配置
AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3000
```

### 生产环境

在 Vercel/Cloudflare 部署平台中配置环境变量：

```env
NEXT_PUBLIC_WEB_URL=https://your-domain.com
STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxx
STRIPE_PRIVATE_KEY=sk_live_xxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx
# ... 其他配置
```

## 🧪 本地测试

### 1. 使用 ngrok 创建隧道

安装并运行 ngrok：

```bash
# 安装 ngrok
npm install -g ngrok

# 启动隧道
ngrok http 3000
```

ngrok 会生成一个临时域名，如：`https://abc123.ngrok-free.app`

### 2. 配置测试 Webhook

1. 在 Stripe 后台的 Webhook 设置中
2. 添加端点：`https://abc123.ngrok-free.app/api/stripe-notify`
3. 复制新的 `whsec_` 密钥到 `.env.development`

### 3. 测试支付流程

1. 启动开发服务器：
   ```bash
   pnpm dev
   ```

2. 访问 http://localhost:3000/pricing

3. 使用 Stripe 测试卡号：
   - **成功**: `4242 4242 4242 4242`
   - **失败**: `4000 0000 0000 0002`
   - 过期日期: 任意未来日期
   - CVC: 任意 3 位数字
   - 邮编: 任意 5 位数字

## 🎨 支付页面预览

项目包含以下支付相关页面：

### 1. 价格表页面
- 路径: `/pricing` 或 `/#pricing`
- 组件: `src/components/blocks/pricing/index.tsx`
- 配置: `src/i18n/pages/pricing/`

### 2. 支付成功页面
- 路径: `/payment/success`
- 组件: `src/app/[locale]/payment/success/page.tsx`
- 特点: 
  - ✨ 彩带动画效果
  - 📧 邮件确认提示
  - 🎯 快速导航按钮

### 3. 支付失败页面
- 路径: `/payment/failed`
- 组件: `src/app/[locale]/payment/failed/page.tsx`
- 特点:
  - 💡 失败原因说明
  - 🔄 重试按钮
  - 📞 客服支持链接

### 4. 支付处理页面
- 路径: `/pay-success/[session_id]`
- 功能: Stripe 回调后的订单处理

## 🎯 定价方案

当前配置了三个塔罗占卜套餐：

| 套餐 | 价格 | 积分 | 有效期 |
|------|------|------|--------|
| 新手启程 | ¥19.9 | 50 | 1个月 |
| 灵性探索 ⭐ | ¥49.9 | 200 | 3个月 |
| 大师之路 | ¥99.9 | 500 | 12个月 |

### 修改定价

编辑配置文件：
- 中文: `src/i18n/pages/pricing/zh.json`
- 英文: `src/i18n/pages/pricing/en.json`

## 💡 支付流程说明

```
用户点击购买
    ↓
检查登录状态
    ↓
调用 /api/checkout
    ↓
创建 Stripe 支付会话
    ↓
跳转到 Stripe 支付页面
    ↓
用户完成支付
    ↓
Stripe 回调到 /pay-success/[session_id]
    ↓
处理订单，增加积分
    ↓
跳转到成功页面
    ↓
同时 Webhook 异步通知
    ↓
/api/stripe-notify 处理通知
```

## ❓ 常见问题

### Q1: 本地测试时支付成功但没收到 Webhook？

**A**: 确保 ngrok 正在运行，并且 Webhook URL 配置正确。检查 Stripe 后台的 Webhook 日志。

### Q2: 支付成功但积分没有增加？

**A**: 检查以下几点：
1. 数据库连接是否正常
2. Webhook secret 是否配置正确
3. 查看服务器日志中的错误信息

### Q3: 如何启用人民币支付（微信/支付宝）？

**A**: 
1. 在 Stripe 后台开通中国支付方式
2. 价格表中配置 `cn_amount` 字段
3. 用户将看到人民币支付图标

### Q4: 如何配置折扣码？

**A**: 
1. 在 Stripe 后台创建优惠券
2. 修改 `src/app/api/checkout/route.ts`
3. 设置 `allow_promotion_codes: true`

### Q5: 如何支持订阅支付？

**A**: 修改价格表配置中的 `interval` 字段：
- `one-time`: 一次性付款
- `month`: 月度订阅
- `year`: 年度订阅

## 📚 相关文档

- [Stripe 官方文档](https://stripe.com/docs)
- [Next.js 环境变量](https://nextjs.org/docs/basic-features/environment-variables)
- [ShipAny 文档](https://docs.shipany.ai/zh/features/payment/stripe)

## 🆘 获取帮助

如遇问题，请：
1. 查看项目 GitHub Issues
2. 参考 ShipAny 社区
3. 联系技术支持

---

**祝您配置顺利！✨** 