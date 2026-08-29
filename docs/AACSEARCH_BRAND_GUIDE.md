# AACSearch Brand & Integration Guide

Complete guide to integrating AACSearch API and SDKs into your applications.

## Overview

AACSearch is an advanced search platform that combines powerful search capabilities with integrated billing, usage tracking, and rate limiting. Our unified API makes it easy to add professional search to any application.

### Key Features

- **AI-Powered Search:** Advanced search algorithms with semantic understanding
- **Integrated Billing:** Per-request pricing with optional token-based variable costs
- **Usage Tracking:** Real-time usage analytics and spending insights
- **Rate Limiting:** Flexible rate limits with pre-flight checks
- **Wallet System:** Credit-based billing with balance tracking
- **Multi-Language Support:** SDKs for JavaScript, Python, PHP, Go, and more
- **Production Ready:** Circuit breaker, automatic retries, caching built-in

## Brand Identity

### Product Name: AACSearch

- **Official name:** AACSearch (not AACSearch.com)
- **Tag line:** "Advanced Search For Everyone"
- **Domain:** api.aacsearch.com (or custom domain)

### Documentation Endpoints

- **API Documentation:** `/api-docs` (Scalar UI)
- **OpenAPI Spec:** `/api/openapi.json`
- **Quickstart:** `/docs/QUICKSTART.md`
- **SDK Guide:** `/docs/SDK_GUIDE.md`
- **Integration Examples:** `/docs/INTEGRATION_EXAMPLES.md`

## API v1 Overview

### Base URL

```
https://api.aacsearch.com
```

### Authentication

All API endpoints require Bearer token authentication:

```
Authorization: Bearer sk_live_xxxxx
```

### Endpoints

#### 1. Search (`GET /api/v1/search`)

Perform a search with integrated billing.

```bash
curl -X GET "https://api.aacsearch.com/api/v1/search?q=query&limit=10" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

**Cost:** $0.01 base + $0.0001 per token

#### 2. Wallet (`GET /api/v1/wallet`)

Get wallet information and balance.

```bash
curl -X GET "https://api.aacsearch.com/api/v1/wallet" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

#### 3. Usage (`GET /api/v1/usage`)

Retrieve usage statistics for a period.

```bash
curl -X GET "https://api.aacsearch.com/api/v1/usage?days=30" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

#### 4. Rate Limits

**GET** - Retrieve limits configuration
**POST** - Check if request is allowed

```bash
curl -X GET "https://api.aacsearch.com/api/v1/rate-limit" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

## SDK Quick Reference

### JavaScript/TypeScript

```bash
npm install @aacsearch/sdk
```

```typescript
import { AACSearchClient } from "@aacsearch/sdk";

const client = new AACSearchClient({ apiKey: "sk_live_xxxxx" });
const results = await client.search("query");
```

### React

```bash
npm install @aacsearch/react-sdk
```

```typescript
import { AACSearchProvider, useSearch } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <SearchComponent />
    </AACSearchProvider>
  );
}
```

### Python

```bash
pip install aacsearch
```

```python
from aacsearch import AACSearchClient

client = AACSearchClient(api_key="sk_live_xxxxx")
results = client.search("query")
```

### PHP

```bash
composer require aacsearch/sdk
```

```php
use AACSearch\Client;

$client = new Client(apiKey: 'sk_live_xxxxx');
$results = $client->search('query');
```

### Go

```bash
go get github.com/aacsearch/go-sdk
```

```go
import "github.com/aacsearch/go-sdk"

client := aacsearch.NewClient("sk_live_xxxxx")
results, _ := client.Search(ctx, "query", nil)
```

## Integration Patterns

### Pattern 1: Simple Search

**Use case:** Basic search functionality

```javascript
async function search(query) {
  const response = await fetch(
    `https://api.aacsearch.com/api/v1/search?q=${encodeURIComponent(query)}`,
    {
      headers: { Authorization: "Bearer sk_live_xxxxx" },
    }
  );

  return response.json();
}
```

### Pattern 2: Search with Balance Check

**Use case:** Ensure sufficient funds before search

```javascript
async function searchSafely(query) {
  const wallet = await client.getWallet();

  if (wallet.balance < 0.02) {
    throw new Error("Insufficient balance");
  }

  return client.search(query);
}
```

### Pattern 3: Rate Limited Queue

**Use case:** Handle multiple searches respecting rate limits

```javascript
const queue = [];

async function queueSearch(query) {
  return new Promise((resolve) => {
    queue.push({ query, resolve });
    processQueue();
  });
}

async function processQueue() {
  while (queue.length > 0) {
    const { query, resolve } = queue.shift();
    const result = await client.search(query);
    resolve(result);

    // Respect rate limits
    await new Promise((r) => setTimeout(r, 100));
  }
}
```

### Pattern 4: Cached Search

**Use case:** Reduce API calls with intelligent caching

```javascript
const cache = new Map();

async function cachedSearch(query) {
  if (cache.has(query)) {
    return cache.get(query);
  }

  const result = await client.search(query);
  cache.set(query, result);
  return result;
}
```

### Pattern 5: Usage Monitoring

**Use case:** Track spending and alert on high usage

```javascript
async function monitorUsage() {
  const stats = await client.getUsageStats(7);

  console.log(`Last 7 days spending: $${stats.totalCost}`);

  if (stats.totalCost > 100) {
    console.warn("High usage detected");
  }
}
```

## Billing Models

### Pay-As-You-Go

- **Base cost:** $0.01 per search
- **Variable cost:** $0.0001 per token
- **Best for:** Unpredictable usage patterns

### Prepaid Credits

- **Purchase credits** in advance
- **Credits never expire**
- **No recurring charges**
- **Best for:** Budget planning

### Subscription Plans

| Plan | Monthly | Daily Limit | Token Limit | Cost |
|------|---------|------------|-----------|------|
| Starter | 100 searches | 10 | 100K tokens | Free |
| Pro | 10,000 searches | 1,000 | 10M tokens | $99/mo |
| Enterprise | Unlimited | Unlimited | Unlimited | Custom |

## Common Integrations

### E-commerce Platform

```javascript
// Search products and deduct from wallet
async function searchProducts(query) {
  const results = await client.search(query);

  // Display results with billing info
  return {
    products: results.results,
    costDeducted: results.costDeducted,
    totalCost: results.costDeducted,
  };
}
```

### SaaS Dashboard

```javascript
// Display search + usage dashboard
function SearchDashboard() {
  const { wallet } = useWallet();
  const { results } = useSearch();
  const { stats } = useUsageStats();

  return (
    <div>
      <WalletCard balance={wallet.balance} />
      <SearchResults results={results} />
      <UsageChart data={stats} />
    </div>
  );
}
```

### Mobile App

```typescript
// Optimized for mobile with caching
const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
  enableCache: true,
  cacheTTL: 3600000, // 1 hour
  maxRetries: 3,
});
```

### AI Assistant Integration

```python
# Use AACSearch as knowledge backend for AI
def search_with_ai(query):
    # Search with AACSearch
    results = client.search(query)

    # Feed to AI model
    context = "\n".join([r.excerpt for r in results])
    response = ai_model.generate(query, context)

    return response
```

## Error Handling Guide

### 401 Unauthorized

**Cause:** Invalid or missing API key

**Solution:**
1. Check API key is correct
2. Verify key is not expired
3. Generate new key if needed

### 402 Payment Required

**Cause:** Insufficient wallet balance

**Solution:**
1. Add funds to wallet
2. Check usage stats for high spending
3. Upgrade to higher plan

### 429 Too Many Requests

**Cause:** Rate limit exceeded

**Solution:**
1. Implement exponential backoff
2. Use request queuing
3. Check rate limit status with pre-flight check
4. Upgrade to higher plan

### 500 Server Error

**Cause:** Server-side issue

**Solution:**
1. Retry with exponential backoff
2. Check status page: status.aacsearch.com
3. Contact support if persists

## Performance Best Practices

1. **Enable caching** for frequent queries
2. **Use pre-flight checks** before requests
3. **Batch searches** when possible
4. **Monitor usage** regularly
5. **Implement circuit breaker** for resilience
6. **Use async/await** for concurrent searches
7. **Cache at application layer** in addition to API cache

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for configuration
3. **Rotate keys regularly** (monthly recommended)
4. **Use separate keys** for development and production
5. **Enable HTTPS** for all requests (enforced by API)
6. **Validate API responses** in your application
7. **Use key expiration** to limit key lifetime

## Migration Guide

### From Other Search Providers

```javascript
// Old provider
const oldResults = await oldClient.search(query);

// AACSearch
const newResults = await aacsearchClient.search(query);

// Similar response format makes migration easy
const { results, count } = newResults;
```

### Version Migration

From v0 to v1:

```javascript
// v0
const results = await client.search(query, { limit: 10 });

// v1 (same interface)
const results = await client.search({ query, limit: 10 });
```

## Support Resources

### Documentation
- **Full Docs:** https://aacsearch.com/docs
- **API Reference:** https://api.aacsearch.com/api-docs
- **SDK Guides:** https://aacsearch.com/docs/sdk
- **Integration Examples:** https://aacsearch.com/examples

### Support Channels
- **Email:** support@aacsearch.com
- **Slack:** https://slack.aacsearch.com
- **GitHub Issues:** https://github.com/aacsearch/issues
- **Status Page:** https://status.aacsearch.com

### Community
- **GitHub:** https://github.com/aacsearch
- **Discord:** https://discord.aacsearch.com
- **Twitter:** @aacsearch
- **Blog:** https://aacsearch.com/blog

## Roadmap

### Q1 2024
- ✅ API v1 with billing
- ✅ JavaScript/TypeScript SDK
- ✅ React SDK
- ✅ PHP SDK

### Q2 2024
- Coming: Python SDK (official)
- Coming: Go SDK (official)
- Coming: Custom webhooks
- Coming: Advanced analytics

### Q3 2024
- Coming: GraphQL API
- Coming: Real-time search streaming
- Coming: Batch indexing API
- Coming: Advanced security features

## FAQ

**Q: How is pricing calculated?**
A: $0.01 per search + $0.0001 per token. Tokens = ceil(query_length/4) + (results*10)

**Q: Can I use API keys in client-side code?**
A: Not recommended. Use a backend proxy or service-to-service authentication.

**Q: What's the rate limit?**
A: 100 requests/min by default. Contact support to increase.

**Q: Do you offer data retention?**
A: Yes, usage data retained for 2 years. Search results not retained.

**Q: Is there a free tier?**
A: Yes, Starter plan includes 100 free searches/month.

**Q: Can I cancel anytime?**
A: Yes, no long-term contracts. Cancel subscription anytime.

**Q: Do you offer SLA?**
A: Yes, 99.9% uptime SLA on Pro and Enterprise plans.

## Getting Started

1. **Sign up** at https://aacsearch.com
2. **Get API key** from dashboard
3. **Choose SDK** for your language
4. **Read quickstart** for your platform
5. **Start building** with examples
6. **Monitor usage** in dashboard
7. **Scale with confidence**

---

For more information, visit https://aacsearch.com/docs
