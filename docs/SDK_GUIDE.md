# SaaS Search SDK Documentation

The SaaS Search SDK provides a simple, type-safe interface for integrating search and billing functionality into your applications.

## Installation

### Node.js / TypeScript

```bash
npm install @saas-search/sdk
# or
pnpm add @saas-search/sdk
# or
yarn add @saas-search/sdk
```

### Configuration

```typescript
import { SaaSSearchClient } from "@saas-search/sdk";

const client = new SaaSSearchClient({
  apiKey: "sk_live_xxxxx", // Your API key
  baseUrl: "https://api.example.com", // Optional, defaults to production
});
```

## Core Methods

### Search

Perform a search query with automatic billing integration.

```typescript
const results = await client.search({
  query: "machine learning",
  limit: 10,
  offset: 0,
});

console.log({
  query: results.query,
  count: results.count,
  results: results.results,
  costDeducted: results.costDeducted,
  remainingBalance: results.remainingBalance,
  tokensUsed: results.tokensUsed,
});
```

**Parameters:**
- `query` (string, required): Search query
- `limit` (number, optional): Maximum results (1-100, default: 10)
- `offset` (number, optional): Pagination offset (default: 0)

**Response:**
```typescript
{
  success: boolean;
  query: string;
  count: number;
  results: Array<{
    id: string;
    title: string;
    excerpt: string;
    score: number;
  }>;
  costDeducted: number; // Total cost in USD
  remainingBalance: number; // Wallet balance after search
  tokensUsed: number;
}
```

### Wallet Management

Get current wallet information:

```typescript
const wallet = await client.getWallet();

console.log({
  balance: wallet.balance, // Current balance in USD
  totalSpent: wallet.totalSpent,
  totalEarned: wallet.totalEarned,
  currency: wallet.currency,
});
```

### Usage Statistics

Retrieve usage statistics for a specific period:

```typescript
// Default: last 30 days
const stats = await client.getUsageStats();

// Get specific period
const stats = await client.getUsageStats(7); // Last 7 days

console.log({
  period: stats.period,
  totalCost: stats.totalCost,
  totalTokensUsed: stats.totalTokensUsed,
  operations: stats.operations,
});
```

### Rate Limits

Get current rate limit configuration:

```typescript
const limits = await client.getRateLimit();

console.log({
  requestsPerMinute: limits.requestsPerMinute,
  requestsPerDay: limits.requestsPerDay,
  monthlyTokenLimit: limits.monthlyTokenLimit,
  concurrentRequests: limits.concurrentRequests,
});
```

Check if a request is allowed (pre-flight check):

```typescript
const allowed = await client.checkLimit();

if (allowed.allowed) {
  console.log(`Requests remaining: ${allowed.remaining}`);
  // Proceed with search
} else {
  console.log(`Rate limit reset at: ${allowed.nextResetAt}`);
  // Handle rate limit
}
```

## Type-Safe Responses

All responses are fully typed with TypeScript:

```typescript
interface SearchResponse<T = unknown> {
  success: boolean;
  query: string;
  count: number;
  results: T[];
  costDeducted: number;
  remainingBalance: number;
  tokensUsed: number;
}

interface WalletInfo {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  totalSpent: number;
  totalEarned: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UsageStats {
  period: { start: Date; end: Date };
  totalCost: number;
  totalTokensUsed: number;
  operations: Array<{
    type: string;
    count: number;
    totalCost: number;
    totalTokens: number;
  }>;
}

interface RateLimitInfo {
  requestsPerMinute: number;
  requestsPerDay: number;
  monthlyTokenLimit: number;
  concurrentRequests: number;
}
```

## Error Handling

The SDK throws typed errors that you can handle:

```typescript
import { SaaSSearchClient, ApiError } from "@saas-search/sdk";

try {
  const results = await client.search({ query: "test" });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.status}):`, error.message);
    
    switch (error.status) {
      case 401:
        // Invalid API key
        break;
      case 402:
        // Insufficient balance
        break;
      case 429:
        // Rate limit exceeded
        break;
      case 500:
        // Server error
        break;
    }
  } else {
    console.error("Unknown error:", error);
  }
}
```

## Usage Examples

### React Component

```typescript
import { useState } from "react";
import { SaaSSearchClient } from "@saas-search/sdk";

const client = new SaaSSearchClient({
  apiKey: process.env.REACT_APP_SEARCH_API_KEY,
});

export function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const [searchResults, walletInfo] = await Promise.all([
        client.search({ query }),
        client.getWallet(),
      ]);

      setResults(searchResults.results);
      setWallet(walletInfo.balance);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {wallet !== null && (
        <div className="wallet-info">Balance: ${wallet.toFixed(2)}</div>
      )}

      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <h3>{result.title}</h3>
            <p>{result.excerpt}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Node.js / Express

```typescript
import express from "express";
import { SaaSSearchClient } from "@saas-search/sdk";

const app = express();
const client = new SaaSSearchClient({
  apiKey: process.env.SEARCH_API_KEY,
});

app.get("/search", async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ error: "Query required" });
    }

    const results = await client.search({
      query: String(q),
      limit: Number(limit),
    });

    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(3000);
```

### Python

```python
from saas_search import SaaSSearchClient

client = SaaSSearchClient(api_key="sk_live_xxxxx")

# Search
results = client.search(
    query="machine learning",
    limit=10,
)

print(f"Found {results['count']} results")
print(f"Cost deducted: ${results['costDeducted']}")
print(f"Remaining balance: ${results['remainingBalance']}")

# Get wallet
wallet = client.get_wallet()
print(f"Current balance: ${wallet['balance']}")

# Get usage
usage = client.get_usage_stats(days=7)
print(f"Total spent in last 7 days: ${usage['totalCost']}")
```

## Billing

### Cost Structure

- **Base search cost:** $0.01 per search
- **Token cost:** $0.0001 per token
- **Tokens calculation:** `ceil(query_length / 4) + (result_count * 10)`

### Example Cost Calculation

```typescript
const query = "machine learning"; // 17 chars
const results = 42; // results count

const queryTokens = Math.ceil(17 / 4); // = 5
const resultTokens = 42 * 10; // = 420
const totalTokens = queryTokens + resultTokens; // = 425

const baseCost = 0.01;
const tokenCost = totalTokens * 0.0001; // = 0.0425
const totalCost = baseCost + tokenCost; // = 0.0525
```

### Pre-flight Balance Check

Always check wallet balance before search in production:

```typescript
async function searchSafely(query: string) {
  const wallet = await client.getWallet();
  const estimatedCost = 0.05; // Conservative estimate

  if (wallet.balance < estimatedCost) {
    throw new Error("Insufficient balance");
  }

  return client.search({ query });
}
```

## Rate Limiting

Each API key has rate limits configured at the plan level:

- **Requests per minute:** Default 100
- **Requests per day:** Default 10,000
- **Monthly token limit:** Default 1,000,000
- **Concurrent requests:** Default 10

When rate limits are exceeded, the API returns a `429` status code.

### Handling Rate Limits

```typescript
async function searchWithRetry(query: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.search({ query });
    } catch (error) {
      if (error.status === 429) {
        const resetAt = new Date(error.nextResetAt);
        const delayMs = resetAt.getTime() - Date.now();

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs + 1000));
          continue;
        }
      }
      throw error;
    }
  }
}
```

## Best Practices

1. **Cache results locally** when possible to reduce API calls
2. **Use pagination** to retrieve large result sets efficiently
3. **Monitor usage** regularly using `getUsageStats()`
4. **Pre-flight checks** for rate limits and balance before searches
5. **Implement exponential backoff** for retries
6. **Keep API keys secure** - never expose in client-side code
7. **Use environment variables** for API key configuration
8. **Implement circuit breaker pattern** for production resilience

## Support

For issues or questions:
- Documentation: https://api.example.com/api-docs
- Email: support@example.com
- GitHub: https://github.com/example/saas-search-sdk
