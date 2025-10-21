# 丢丢塔罗 (DiuDiu Tarot)

神秘塔罗牌占卜平台 - 穿越78张牌的神秘帷幕，揭示命运隐藏的轨迹。

![preview](preview.png)

## Quick Start

1. Clone the repository

```bash
git clone https://github.com/shipanyai/shipany-template-one.git
```

2. Install dependencies

```bash
pnpm install
```

3. **Configure Database** (Important!)

```bash
# Option 1: Use PowerShell script (Recommended for Windows)
.\set-db-env.ps1

# Option 2: Create .env.local file (One-time setup)
# Create .env.local and add:
# DATABASE_URL=your_database_url
# AUTH_SECRET=your_random_secret_key
```

📚 See [DATABASE_QUICKSTART.md](./DATABASE_QUICKSTART.md) for detailed setup guide.

4. Run the development server

```bash
pnpm dev
```

Visit http://localhost:3000 to see your app!

## Customize

- Set your environment variables

```bash
cp .env.example .env.development
```

- Set your theme in `src/app/theme.css`

[tweakcn](https://tweakcn.com/editor/theme)

- Set your landing page content in `src/i18n/pages/landing`

- Set your i18n messages in `src/i18n/messages`

## Deploy

- Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fshipanyai%2Fshipany-template-one&project-name=my-shipany-project&repository-name=my-shipany-project&redirect-url=https%3A%2F%2Fshipany.ai&demo-title=ShipAny&demo-description=Ship%20Any%20AI%20Startup%20in%20hours%2C%20not%20days&demo-url=https%3A%2F%2Fshipany.ai&demo-image=https%3A%2F%2Fpbs.twimg.com%2Fmedia%2FGgGSW3La8AAGJgU%3Fformat%3Djpg%26name%3Dlarge)

- Deploy to Cloudflare

for new project, clone with branch "cloudflare"

```shell
git clone -b cloudflare https://github.com/shipanyai/shipany-template-one.git
```

for exist project, checkout to branch "cloudflare"

```shell
git checkout cloudflare
```

1. Customize your environment variables

```bash
cp .env.example .env.production
cp wrangler.toml.example wrangler.toml
```

edit your environment variables in `.env.production`

and put all the environment variables under `[vars]` in `wrangler.toml`

2. Deploy

```bash
npm run cf:deploy
```

## 📚 Documentation

- 🗄️ [Database Setup Guide](./DATABASE_SETUP.md) - Complete database configuration
- 🚀 [Database Quick Start](./DATABASE_QUICKSTART.md) - Get started in 5 minutes
- 💳 [Payment Setup](./PAYMENT_SETUP.md) - Configure Stripe payments
- ⚡ [Payment Quick Start](./PAYMENT_QUICKSTART.md) - Payment features overview

## ✨ Features

- 🔮 **Tarot Reading System** - 4 deck types with 78 cards each
- 💳 **Payment Integration** - Stripe payment with CNY & USD support
- 👤 **User Authentication** - Email, Google, and social login
- 💰 **Credit System** - Virtual currency and subscription management
- 📊 **Admin Dashboard** - User and order management
- 🌍 **Multi-language** - Support for Chinese and English
- 🎨 **Dark Mode** - Beautiful dark/light theme switching
- 📱 **Responsive Design** - Perfect on all devices

## 🎯 Database Status

✅ PostgreSQL database initialized and configured  
✅ 9 tables created (users, orders, credits, tarot_cards, etc.)  
✅ 136 tarot cards data loaded (4 decks × 34 cards)  
✅ Payment system ready  
✅ Ready for production deployment

## Community

- [ShipAny](https://shipany.ai)
- [Documentation](https://docs.shipany.ai)

## License

- [ShipAny AI SaaS Boilerplate License Agreement](LICENSE)
