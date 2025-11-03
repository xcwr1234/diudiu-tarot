# 🔑 DeepSeek API 配置指南

## ❌ 当前问题

您看到错误消息：
```
"抱歉，我遇到了一些技术问题。请稍后再试，或者刷新页面重新开始。"
```

**原因**：DeepSeek API Key 未配置或无效

终端错误：
```
Error: 401 Authentication Fails, Your api key: ****here is invalid
```

---

## ✅ 解决方案

### 步骤 1：获取 DeepSeek API Key

1. **访问 DeepSeek 官网**
   ```
   https://platform.deepseek.com
   ```

2. **注册/登录账号**
   - 如果没有账号，点击"注册"
   - 已有账号直接登录

3. **进入 API Keys 页面**
   - 登录后，找到"API Keys"菜单
   - 或直接访问：https://platform.deepseek.com/api_keys

4. **创建新的 API Key**
   - 点击"创建 API Key"按钮
   - 给密钥命名（如：tarot-app）
   - 点击"确认"

5. **复制 API Key**
   - ⚠️ **重要**：密钥只显示一次，请立即复制保存
   - 格式类似：`sk-xxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 2：配置环境变量

#### 方法 A：创建 .env.local 文件（推荐）

1. **在项目根目录创建文件**
   ```
   项目位置：E:\Microsoft VS Code\wzy20\shipany-template-one-main
   文件名：.env.local
   ```

2. **添加以下内容**（用您的实际 API Key 替换）
   ```env
   # 认证配置
   AUTH_SECRET=demo-secret-key-for-development-only
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_WEB_URL=http://localhost:3000

   # DeepSeek AI 配置（必需）
   DEEPSEEK_API_KEY=sk-your-actual-api-key-here
   ```

3. **保存文件**

#### 方法 B：使用 PowerShell 创建（快速）

在项目目录打开 PowerShell，运行：

```powershell
cd "E:\Microsoft VS Code\wzy20\shipany-template-one-main"

@"
AUTH_SECRET=demo-secret-key-for-development-only
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
DEEPSEEK_API_KEY=sk-your-actual-api-key-here
"@ | Out-File -FilePath .env.local -Encoding utf8
```

**⚠️ 记得替换 `sk-your-actual-api-key-here` 为您的真实 API Key！**

### 步骤 3：重启开发服务器

配置完成后，必须重启服务器：

1. **停止当前服务器**
   - 在运行 `npm run dev` 的终端按 `Ctrl + C`

2. **重新启动**
   ```powershell
   cd "E:\Microsoft VS Code\wzy20\shipany-template-one-main"
   npm run dev
   ```

3. **等待启动完成**
   看到 `✓ Ready in XXms` 表示启动成功

### 步骤 4：测试对话功能

1. **刷新浏览器**
   ```
   Ctrl + F5
   ```

2. **访问主页**
   ```
   http://localhost:3000
   ```

3. **点击"开始占卜"**

4. **发送消息测试**
   输入："你好"

**预期结果**：
- ✅ AI 正常回复（不再显示错误消息）
- ✅ 看到月影塔罗师的温暖回应

---

## 📋 配置文件示例

### 完整的 .env.local 示例

```env
# ================================
# 认证配置
# ================================
AUTH_SECRET=demo-secret-key-for-development-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# ================================
# DeepSeek AI 配置（必需）
# ================================
DEEPSEEK_API_KEY=sk-1234567890abcdefghijklmnopqrstuvwxyz

# ================================
# 可选配置
# ================================
# DATABASE_URL=postgresql://postgres:password@localhost:5432/dbname
# AUTH_GOOGLE_ID=your_google_client_id
# AUTH_GOOGLE_SECRET=your_google_client_secret
```

---

## 🔍 验证配置

### 检查配置是否正确

**方法 1：检查文件是否存在**
```powershell
cd "E:\Microsoft VS Code\wzy20\shipany-template-one-main"
Test-Path .env.local
```
应该返回 `True`

**方法 2：查看文件内容**
```powershell
Get-Content .env.local
```
应该看到您配置的环境变量

**方法 3：检查服务器日志**
启动服务器后，应该看到：
```
- Environments: .env.local, .env.development
```

---

## 💰 DeepSeek API 费用

### 定价信息

- **DeepSeek-Chat** 模型定价（2024年）：
  - 输入：¥0.001/1K tokens
  - 输出：¥0.002/1K tokens

- **示例成本**：
  - 一次完整的塔罗对话（约10轮）：约 ¥0.02-0.05
  - 非常便宜！💰

### 充值建议

- 初次测试：充值 ¥10-20 足够使用很久
- 正式使用：根据需求充值

---

## ⚠️ 安全注意事项

### 保护您的 API Key

1. **不要提交到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 不会意外提交到代码库

2. **不要分享**
   - API Key 是私密的
   - 不要发送给他人或公开

3. **定期轮换**
   - 定期更换 API Key
   - 如果泄露，立即删除并创建新的

4. **监控使用情况**
   - 在 DeepSeek 控制台查看使用量
   - 设置使用限额

---

## 🐛 常见问题

### Q1: 仍然显示 401 错误？

**检查清单**：
- [ ] API Key 是否正确复制（没有多余空格）
- [ ] `.env.local` 文件是否在正确位置
- [ ] 是否重启了开发服务器
- [ ] API Key 是否有效（未过期/删除）

### Q2: API Key 在哪里查看？

访问：https://platform.deepseek.com/api_keys

⚠️ **注意**：创建后只显示一次！如果忘记，需要创建新的。

### Q3: 没有收到 AI 回复？

可能原因：
1. **API 配额用完**：检查账户余额
2. **网络问题**：检查网络连接
3. **API Key 无效**：重新创建

### Q4: 可以使用其他 AI 服务吗？

目前代码使用 DeepSeek API，如需更换：
- OpenAI GPT
- Azure OpenAI
- 其他兼容 OpenAI API 的服务

需要修改 `src/app/api/tarot/chat/route.ts` 中的配置。

---

## 🎯 快速诊断

### 如果配置后仍有问题

**在终端查看详细错误**：
```
启动服务器后，点击"开始占卜"并发送消息
查看终端输出，会显示具体错误信息
```

**常见错误信息**：
- `401 Authentication Fails` → API Key 无效
- `402 Insufficient Balance` → 余额不足
- `429 Rate Limit` → 请求太频繁
- `500 Internal Error` → API 服务问题

---

## ✅ 配置成功标志

配置成功后，您应该看到：

1. **终端无错误**
   ```
   POST /api/tarot/chat 200 in XXXXms
   ```
   （200 表示成功）

2. **浏览器收到 AI 回复**
   - 不再显示错误消息
   - 看到月影塔罗师的正常回复

3. **完整对话流程**
   - 可以多轮对话
   - AI 能理解上下文
   - 可以完成完整占卜

---

## 📞 需要帮助？

如果按照以上步骤仍无法解决，请提供：
1. `.env.local` 文件内容（隐藏 API Key）
2. 终端完整错误信息
3. 浏览器控制台错误（F12 → Console）

---

**配置完成后，记得重启服务器！** 🚀

**祝您配置顺利！** ✨
















