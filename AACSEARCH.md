# AACSearch - Advanced Semantic Search SaaS Platform

**AACSearch** is a modern, enterprise-grade semantic search platform designed as a paid SaaS service with built-in AI assistance, multi-tenant architecture, and comprehensive SDKs.

## 🎯 Overview

AACSearch provides:

- **Semantic Search API**: AI-powered search that understands context and meaning
- **AI Search Assistant**: Intelligent chat interface to help refine searches
- **Multi-Tenant Architecture**: Complete data isolation and security
- **Usage-Based Billing**: Transparent, pay-as-you-go pricing
- **Advanced Analytics**: Real-time insights into search patterns
- **Comprehensive SDKs**: React, PHP, JavaScript, TypeScript support
- **Enterprise Features**: Webhooks, API keys, rate limiting, monitoring

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Applications                       │
├──────────────┬──────────────┬──────────────┬─────────────────┤
│  React Apps  │  PHP Backend │   JS/TS     │  Mobile Apps    │
└──────────────┴──────────────┴──────────────┴─────────────────┘
                              │
                    ┌─────────▼────────────┐
                    │  AACSearch API       │
                    │  (Next.js + Node.js) │
                    └─────────┬────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
    ┌────▼────┐      ┌────────▼────────┐    ┌─────▼─────┐
    │  Auth   │      │  Search Engine  │    │ Analytics │
    │ (Better │      │  (Typesense)    │    │ & Billing │
    │  Auth)  │      └────────┬────────┘    └─────┬─────┘
    └────┬────┘               │                   │
         │         ┌─────────▼────────────┐      │
         └────────►│ PostgreSQL Database  │◄─────┘
                   └──────────────────────┘
```

### Key Components

#### Frontend Layer
- **Search Explorer**: Professional search interface with AI assistant
- **Dashboard**: Analytics, API keys, webhooks management
- **User Account**: Settings, billing, usage tracking

#### API Layer
- **REST API**: Comprehensive endpoint for all operations
- **OpenAPI Documentation**: Interactive API documentation
- **Rate Limiting**: Per-user and global rate limits
- **Authentication**: API key and JWT-based auth

#### Backend Services
- **Auth Service**: User authentication and authorization
- **Search Service**: Integration with search engine
- **Analytics Service**: Usage tracking and reporting
- **Billing Service**: Cost calculation and tracking
- **AI Assistant**: Claude API integration for search help

#### Data Layer
- **PostgreSQL**: Primary database (users, API keys, usage)
- **Typesense**: Search engine for indexed data
- **Redis**: Caching and rate limiting (in production)

## 🚀 Core Features

### 1. Advanced Search

**Search Explorer Page** (`/dashboard/explorer`)
- Collections browser
- Multiple search modes (Prefix, Infix, Exact, Semantic)
- Faceted filtering
- Real-time result highlighting
- Search history tracking
- Document detail panel

**Search Modes:**
- **Prefix**: Search at the beginning of words
- **Infix**: Search anywhere within words
- **Exact**: Exact phrase matching
- **Semantic**: AI-powered contextual search (default)

### 2. AI Search Assistant

**Smart Search Help** (integrated in Search Explorer)
- Chat-based search guidance
- Query suggestions and refinement
- Search tips and tricks
- Context-aware assistance
- Real-time message history

**Features:**
- Claude AI powered
- Conversational interface
- Automatic query optimization
- Historical context awareness

### 3. API Management

**API Keys Page** (`/dashboard/api-keys`)
- Generate and manage API keys
- Rate limit configuration
- Expiration dates
- Last used tracking
- Key testing and validation

**Rate Limiting:**
- Per-minute limits
- Per-day limits
- Monthly quotas
- Graceful rate limit handling

### 4. Analytics Dashboard

**Usage Tracking** (`/dashboard/analytics`)
- Total requests and costs
- Trend visualization
- Operation breakdown
- Cost analysis
- Peak usage times

### 5. Webhooks

**Event-Driven Architecture** (`/dashboard/webhooks`)
- Multiple event types
- Custom webhook URLs
- Event history
- HMAC-SHA256 signing
- Retry mechanism

**Webhook Events:**
- `search.completed`
- `wallet.low_balance`
- `wallet.insufficient`
- `rate_limit.exceeded`

### 6. Usage-Based Billing

**Transparent Pricing:**
- Per-request charges
- Per-token charges
- Tiered pricing (Free, Starter, Pro, Enterprise)
- Monthly invoices
- Real-time cost tracking

## 📦 SDK Packages

### React SDK (`@aacsearch/react-sdk`)

Complete React integration with hooks and components.

**Exports:**
```tsx
// Client
export { AACSearchClient }

// Hooks
export {
  useAACSearch,        // Search with debouncing
  useAACDocument,      // Fetch specific document
  useAACUsage,         // Track usage metrics
  useAACSearchSuggestions  // Get search suggestions
}
```

**Usage:**
```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

const client = new AACSearchClient({ apiKey: "sk_live_..." });
const { data, loading } = useAACSearch(client, query);
```

### Shared Package (`@aacsearch/shared`)

Type definitions and utilities for all SDKs.

**Exports:**
```ts
// Types
export type { SearchRequest, SearchResponse, UsageMetrics, ... }

// Utils
export { formatCurrency, retryAsync, debounce, ... }
```

### Planned SDKs

- **PHP SDK**: Laravel and standalone PHP support
- **JavaScript SDK**: Vanilla JavaScript client
- **Vue.js SDK**: Vue 3 integration
- **Angular SDK**: Angular reactive forms support

## 🔐 Security & Multi-Tenancy

### Data Isolation
- Row-level security policies in database
- Customer-specific API keys
- Isolated collections per customer
- No cross-customer data leakage

### Authentication
- Email + magic link authentication
- Optional OAuth providers
- API key management
- JWT session tokens

### Rate Limiting
- Per-customer limits
- Per-API-key limits
- Automatic enforcement
- Rate limit headers

### Data Protection
- End-to-end encryption
- Secure API key hashing
- HMAC-SHA256 webhook signing
- Regular security audits

## 📊 Analytics & Monitoring

### Tracked Metrics
- Total API requests
- Token usage
- Cost per operation
- Search patterns
- Peak usage times
- Error rates

### Available Reports
- Daily/weekly usage trends
- Cost breakdown by operation
- Top searches
- User activity
- Performance metrics

## 💰 Pricing Models

### Tier Breakdown
- **Free**: 1,000 requests/month
- **Starter**: 100,000 requests/month + $99/month
- **Pro**: Unlimited + $299/month
- **Enterprise**: Custom pricing + dedicated support

### Billing Variables
- Per-request charge: $0.001 (varies by plan)
- Per-token charge: $0.00001
- Discounts for annual billing
- Volume discounts available

## 🔌 API Endpoints

### Search
```
POST /api/v1/search
```

### Collections
```
GET /api/v1/collections
GET /api/v1/collections/{name}
```

### Documents
```
GET /api/v1/collections/{collection}/documents/{id}
```

### Usage
```
GET /api/v1/usage
GET /api/v1/analytics
```

### API Keys
```
GET /api/api-keys
POST /api/api-keys
DELETE /api/api-keys/{keyId}
POST /api/api-keys/{keyId}/test
```

### Webhooks
```
GET /api/webhooks
POST /api/webhooks
DELETE /api/webhooks/{id}
POST /api/webhooks/{id}/test
```

### AI Assistant
```
POST /api/ai/search-assist
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (pages)/              # Marketing pages
│   ├── (auth)/               # Auth flows
│   ├── dashboard/            # Protected app
│   │   ├── explorer/         # Search Explorer
│   │   ├── analytics/        # Analytics dashboard
│   │   ├── api-keys/         # API key management
│   │   ├── webhooks/         # Webhook config
│   │   └── _components/
│   │       ├── app-sidebar.tsx
│   │       └── ai-search-assistant.tsx
│   └── api/
│       ├── v1/              # API endpoints
│       ├── ai/              # AI endpoints
│       └── webhooks/        # Webhook handlers
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   └── homepage/            # Homepage sections
├── lib/
│   ├── auth/               # Authentication logic
│   ├── analytics/          # Analytics service
│   ├── billing/            # Billing provider
│   ├── webhooks/           # Webhook service
│   ├── search/             # Search engine integration
│   └── middleware/         # Middleware
└── database/
    ├── schema.ts           # Drizzle ORM schema
    └── migrations/         # SQL migrations

packages/
├── shared/                  # Shared types & utils
├── react-sdk/              # React SDK
└── README.md              # SDK documentation
```

## 🎨 Design System

### Color Scheme (ParadeDB-inspired)
- **Primary**: Indigo (`#4F46E5`)
- **Secondary**: Indigo light (`#818CF8`)
- **Neutral**: Slate palette
- **Accent**: Indigo on dark mode

### Components
- Shadcn/ui components
- Tailwind CSS utilities
- Dark mode support
- Responsive design

## 🔄 Development Workflow

### Core Commands
```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Check code quality
pnpm type-check   # TypeScript validation
pnpm test         # Run tests
```

### Database
```bash
pnpm db:generate  # Create migration
pnpm db:migrate   # Apply migrations
pnpm db:push      # Push schema
```

## 📈 Roadmap

### Phase 1: Foundation (Complete)
- [x] Core SaaS platform
- [x] Search Explorer with AI assistant
- [x] API key management
- [x] Analytics dashboard
- [x] Webhook system
- [x] React SDK

### Phase 2: Expansion (In Progress)
- [ ] PHP SDK
- [ ] JavaScript SDK
- [ ] Vue.js SDK
- [ ] Advanced filtering UI
- [ ] Team management
- [ ] Custom branding

### Phase 3: Enterprise (Planned)
- [ ] GraphQL API
- [ ] Real-time search
- [ ] Advanced aggregations
- [ ] Compliance certifications
- [ ] White-label solutions
- [ ] Mobile apps

## 🤝 Contributing

### Getting Started
1. Clone the repository
2. Install dependencies: `pnpm install`
3. Start dev server: `pnpm dev`
4. Make changes on feature branch
5. Run tests and linting
6. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- 90%+ test coverage
- JSDoc comments for public APIs

## 📖 Documentation

### For Users
- [Search Explorer Guide](./docs/SEARCH_EXPLORER.md)
- [API Documentation](/api-docs)
- [Pricing & Plans](./docs/PRICING.md)

### For Developers
- [SDK Documentation](./packages/README.md)
- [API Reference](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)

## 🆘 Support

- **Documentation**: https://docs.aacsearch.io
- **GitHub Issues**: https://github.com/AAChibilyaev/SaaS-Starter/issues
- **Email Support**: support@aacsearch.io
- **Discord Community**: https://discord.gg/aacsearch

## 📄 License

MIT License - See LICENSE file for details

## 👥 Team

Built with ❤️ by the AACSearch team

---

**Latest Update**: August 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
