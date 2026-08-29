# 🔍 AACSearch - Advanced Semantic Search SaaS Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)

**AACSearch** is a production-ready paid SaaS platform for semantic search with AI assistance, multi-tenant architecture, and comprehensive SDKs for React, JavaScript/TypeScript, and PHP.

## ✨ Key Features

### 🚀 Core Platform
- **Semantic Search API** - AI-powered contextual search
- **AI Search Assistant** - Claude-powered search guidance
- **Multi-Tenant** - Complete data isolation
- **Usage-Based Billing** - Transparent pay-as-you-go pricing
- **Analytics Dashboard** - Real-time insights
- **Webhook System** - Event-driven architecture
- **API Key Management** - Secure key generation and rotation

### 🤖 AI Intelligence
- Chat-based search assistance
- Query optimization suggestions
- Real-time search help
- Conversation history tracking
- Context-aware recommendations

### 📦 Developer SDKs

#### React SDK (`@aacsearch/react-sdk`)
```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

const client = new AACSearchClient({ apiKey: "sk_live_..." });
const { data, loading } = useAACSearch(client, query);
```

#### JavaScript SDK (`@aacsearch/sdk`)
```javascript
const { AACSearchClient } = require("@aacsearch/sdk");

const client = new AACSearchClient({ apiKey: "sk_live_..." });
const results = await client.search({ q: "query" });
```

#### PHP SDK (`aacsearch/php-sdk`)
```php
use AACSearch\Client;

$client = new Client(['apiKey' => 'sk_live_...']);
$results = $client->search(['q' => 'query']);
```

## 🎯 Project Structure

```
AACSearch/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── explorer/        # Search Explorer with AI
│   │   │   ├── analytics/       # Analytics Dashboard
│   │   │   ├── api-keys/        # API Key Management
│   │   │   └── webhooks/        # Webhook Configuration
│   │   └── api/
│   │       ├── v1/search        # Search API
│   │       ├── ai/search-assist # AI Assistant API
│   │       └── webhooks/        # Webhook Handlers
│   ├── components/
│   │   ├── ui/                  # UI Components
│   │   ├── dashboard/           # Dashboard Components
│   │   └── ai-search-assistant/ # AI Assistant
│   └── lib/
│       ├── auth/                # Authentication
│       ├── billing/             # Billing System
│       └── webhooks/            # Webhook Service
│
├── packages/
│   ├── shared/              # Shared Types & Utils
│   ├── react-sdk/           # React SDK
│   ├── js-sdk/              # JavaScript SDK
│   └── php-sdk/             # PHP SDK
│
├── AACSEARCH.md             # Platform Overview
└── SDK_INTEGRATION_GUIDE.md # SDK Integration Guide
```

## 🚀 Quick Start

### 1. Get Started with AACSearch

```bash
# Clone the repository
git clone https://github.com/AAChibilyaev/SaaS-Starter.git
cd SaaS-Starter

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

### 2. Choose Your SDK

#### React Application
```bash
npm install @aacsearch/react-sdk

# In your React component
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";
```

#### Node.js / Browser
```bash
npm install @aacsearch/sdk

# In your JavaScript file
const { AACSearchClient } = require("@aacsearch/sdk");
```

#### PHP Application
```bash
composer require aacsearch/php-sdk

// In your PHP file
use AACSearch\Client;
$client = new Client(['apiKey' => 'sk_live_...']);
```

### 3. Get Your API Key

1. Sign up at [https://aacsearch.io](https://aacsearch.io)
2. Navigate to Dashboard → API Keys
3. Click "Generate Key"
4. Use the key in your SDK client

## 📚 Documentation

### Platform Guides
- **[AACSEARCH.md](./AACSEARCH.md)** - Complete platform overview
- **[SDK Integration Guide](./SDK_INTEGRATION_GUIDE.md)** - Getting started with SDKs
- **[.env.example](./.env.example)** - Environment configuration

### SDK Documentation
- **[React SDK](./packages/react-sdk/README.md)** - React integration guide
- **[JavaScript SDK](./packages/js-sdk/README.md)** - Node.js & Browser SDK
- **[PHP SDK](./packages/php-sdk/README.md)** - PHP & Laravel SDK
- **[Shared Package](./packages/shared/README.md)** - Types & Utilities

## 💻 Development

### Prerequisites
- Node.js 18+
- pnpm 8+
- PostgreSQL 14+
- Redis (optional, for production)

### Core Commands

```bash
# Development
pnpm dev           # Start dev server
pnpm dev --filter packages/react-sdk  # Dev specific SDK

# Building
pnpm build         # Production build
pnpm build --filter packages          # Build all SDKs

# Quality
pnpm lint          # ESLint
pnpm type-check    # TypeScript
pnpm test          # Run tests

# Database
pnpm db:generate   # Create migration
pnpm db:migrate    # Apply migrations
pnpm db:push       # Push schema (dev only)
```

## 🎨 Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL, Redis
- **Auth**: Better Auth with magic links & OAuth
- **Search**: Typesense integration
- **AI**: Claude API (Anthropic)
- **Storage**: Cloudflare R2
- **Email**: Resend
- **Billing**: Creem integration

## 📦 SDK Features

### React SDK
- ✅ TypeScript support
- ✅ Custom hooks (useAACSearch, useAACUsage, etc.)
- ✅ Built-in debouncing
- ✅ Error handling
- ✅ Zero dependencies

### JavaScript SDK
- ✅ Node.js & Browser
- ✅ ESM & CommonJS
- ✅ Full TypeScript
- ✅ Fetch API based
- ✅ Error handling

### PHP SDK
- ✅ Laravel integration
- ✅ Guzzle HTTP
- ✅ PSR-16 caching
- ✅ Exception handling
- ✅ PHP 8.0+

## 💰 Pricing Model

- **Base Cost**: $0.001 per search
- **Token Cost**: $0.00001 per token
- **Free Tier**: 1,000 requests/month
- **Plans**: Free, Starter, Pro, Enterprise

## 🔐 Security

- Row-level database security
- API key hashing
- HMAC-SHA256 webhook signing
- Data isolation per customer
- End-to-end encryption
- Rate limiting per customer

## 🎯 API Endpoints

```bash
# Search
POST   /api/v1/search              # Search documents
GET    /api/v1/collections         # List collections
GET    /api/v1/collections/{name}  # Get collection details
GET    /api/v1/collections/{col}/documents/{id}

# Usage & Billing
GET    /api/v1/usage               # Get usage metrics
GET    /api/v1/analytics           # Analytics data

# API Keys
GET    /api/api-keys               # List API keys
POST   /api/api-keys               # Create API key
DELETE /api/api-keys/{keyId}       # Delete API key

# Webhooks
GET    /api/webhooks               # List webhooks
POST   /api/webhooks               # Create webhook
DELETE /api/webhooks/{id}          # Delete webhook

# AI Assistant
POST   /api/ai/search-assist       # Get AI search help
```

## 🛠️ Common Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes in `src/app` or `packages/`
3. Run tests and linting: `pnpm lint && pnpm type-check`
4. Commit: `git commit -m "feat: description"`
5. Push and create PR

### Updating SDKs
1. Update SDK code in `packages/*/src/`
2. Update types if needed
3. Rebuild: `pnpm build --filter packages`
4. Update version in package.json
5. Publish to npm/composer

### Deploying
1. Ensure all tests pass
2. Build for production: `pnpm build`
3. Deploy using your chosen platform (Vercel, Railway, etc.)
4. Set environment variables on deployment platform

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feat/new-feature`)
3. Make changes and test locally
4. Run linting and type checking
5. Commit with clear messages
6. Push and submit PR

## 📊 Analytics & Monitoring

Track your API usage:
- Real-time request counts
- Cost breakdown by operation
- Search patterns analysis
- Peak usage times
- Error rate monitoring

## 🆘 Support & Resources

- **Documentation**: https://docs.aacsearch.io
- **GitHub Issues**: https://github.com/AAChibilyaev/SaaS-Starter/issues
- **Email Support**: support@aacsearch.io
- **Discord Community**: https://discord.gg/aacsearch
- **Status Page**: https://status.aacsearch.io

## 🗺️ Roadmap

### Q1 2024
- [ ] Vue.js SDK
- [ ] Angular SDK
- [ ] GraphQL API
- [ ] Advanced analytics dashboard

### Q2 2024
- [ ] Real-time search subscriptions
- [ ] Team management
- [ ] Custom branding
- [ ] Enterprise features

### Q3 2024
- [ ] Mobile apps (iOS/Android)
- [ ] Desktop clients
- [ ] Advanced AI features
- [ ] White-label solution

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

## 👨‍💻 Built By

AACSearch Team - Building the future of semantic search.

---

## 🌟 Stars & Support

If you find AACSearch helpful, please give it a star! ⭐

**Made with ❤️ for the search community**

---

**Latest Update**: August 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
