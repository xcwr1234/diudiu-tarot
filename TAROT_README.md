# 塔罗牌占卜功能

## 功能概述

本项目已成功集成了完整的塔罗牌占卜功能，支持四种不同的塔罗牌体系：

- **马赛塔罗 (Marseille Tarot)** - 传统法国符号系统
- **黄金黎明 (Golden Dawn)** - 赫尔墨斯卡巴拉对应关系
- **维特塔罗 (Rider-Waite Tarot)** - 经典图像和象征主义
- **头特塔罗 (Thoth Tarot)** - 克劳利的密教智慧

## 功能特性

### 🎴 牌组选择
- 支持四种不同的塔罗牌体系
- 每种体系都有完整的78张牌（22张大阿卡纳 + 56张小阿卡纳）
- 包含正位和逆位的详细解释

### 🔮 占卜方式
- **单张牌占卜** - 快速日常指导
- **三张牌占卜** - 过去、现在、未来
- **凯尔特十字** - 全面解读（10张牌）
- **马蹄形占卜** - 七张牌布局

### ✨ 交互体验
- 精美的卡片翻转动画
- 逐步揭示卡片内容
- 详细的牌面解释和整体解读
- 响应式设计，支持移动端

## 技术实现

### 数据库结构

```sql
-- 塔罗牌占卜记录表
CREATE TABLE tarot_readings (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  user_uuid VARCHAR(255) NOT NULL,
  deck_type VARCHAR(50) NOT NULL,
  spread_type VARCHAR(50) NOT NULL,
  question TEXT,
  cards_drawn TEXT, -- JSON数组
  interpretation TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 塔罗牌参考表
CREATE TABLE tarot_cards (
  id SERIAL PRIMARY KEY,
  card_name VARCHAR(255) NOT NULL,
  deck_type VARCHAR(50) NOT NULL,
  card_number INTEGER,
  suit VARCHAR(50),
  arcana_type VARCHAR(50), -- major, minor
  upright_meaning TEXT,
  reversed_meaning TEXT,
  keywords TEXT, -- JSON数组
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE
);
```

### 文件结构

```
src/
├── app/
│   ├── api/tarot/reading/route.ts    # 占卜API
│   └── [locale]/(default)/tarot/page.tsx  # 占卜页面
├── components/
│   └── blocks/tarot/index.tsx        # 占卜组件
├── models/
│   └── tarot.ts                      # 数据模型
├── services/
│   └── tarot.ts                      # 业务逻辑
├── types/
│   └── tarot.d.ts                    # 类型定义
└── scripts/
    └── init-tarot-data.ts            # 数据初始化脚本
```

## 安装和设置

### 1. 数据库迁移

```bash
# 生成迁移文件
npm run db:generate

# 应用迁移
npm run db:migrate
```

### 2. 初始化塔罗牌数据

```bash
# 运行数据初始化脚本
npm run init:tarot
```

### 3. 启动开发服务器

```bash
npm run dev
```

## 使用方法

### 用户流程

1. **访问占卜页面**
   - 从首页点击"Tarot Reading"按钮
   - 或直接访问 `/tarot` 路径

2. **选择占卜设置**
   - 选择塔罗牌体系（马赛、黄金黎明、维特、头特）
   - 选择占卜方式（单张、三张、凯尔特十字、马蹄形）
   - 输入你的问题

3. **开始占卜**
   - 点击"Begin Reading"按钮
   - 系统会随机抽取相应数量的牌

4. **揭示卡片**
   - 逐个点击"Reveal Card"按钮揭示卡片
   - 查看每张牌的正位/逆位解释

5. **查看解读**
   - 所有卡片揭示后，查看整体解读
   - 可以开始新的占卜

### API 使用

```javascript
// 发起占卜请求
const response = await fetch('/api/tarot/reading', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    deck_type: 'waite',
    spread_type: 'three_card',
    question: 'What does my future hold?'
  })
});

const result = await response.json();
```

## 自定义和扩展

### 添加新的塔罗牌体系

1. 在 `src/models/tarot.ts` 中添加新的 `DeckType`
2. 在 `src/scripts/init-tarot-data.ts` 中添加对应的牌组数据
3. 更新前端组件中的选项

### 添加新的占卜方式

1. 在 `src/models/tarot.ts` 中添加新的 `SpreadType`
2. 在 `src/services/tarot.ts` 中更新卡片数量逻辑
3. 更新前端组件中的选项

### 自定义解读逻辑

修改 `src/services/tarot.ts` 中的 `generateInterpretation` 函数来自定义解读生成逻辑。

## 注意事项

1. **用户认证**: 占卜功能需要用户登录
2. **数据安全**: 所有占卜记录都会保存到数据库
3. **性能优化**: 大量卡片数据已优化查询性能
4. **移动端支持**: 完全响应式设计

## 故障排除

### 常见问题

1. **数据库连接错误**
   - 检查 `DATABASE_URL` 环境变量
   - 确保数据库服务正在运行

2. **卡片数据缺失**
   - 运行 `npm run init:tarot` 初始化数据
   - 检查数据库连接

3. **API 错误**
   - 检查用户认证状态
   - 验证请求参数格式

## 贡献指南

欢迎为塔罗牌功能贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

## 许可证

本项目遵循 ShipAny AI SaaS 启动模板许可证协议。 