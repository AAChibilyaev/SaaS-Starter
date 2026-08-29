# AACSearch JavaScript SDK

Advanced search SDK for AACSearch API v1. Full TypeScript support, built-in caching, retry strategies, and request queuing.

## Features

- ✅ Full TypeScript support with type definitions
- ✅ Automatic retry with exponential backoff
- ✅ Request queuing and rate limit handling
- ✅ Local result caching with TTL
- ✅ Real-time wallet and usage monitoring
- ✅ Pre-flight checks for balance and limits
- ✅ Circuit breaker pattern for resilience
- ✅ Comprehensive error handling
- ✅ Minimal bundle size (~15kb gzipped)

## Installation

```bash
npm install @aacsearch/sdk
# or
pnpm add @aacsearch/sdk
# or
yarn add @aacsearch/sdk
```

## Quick Start

```typescript
import { AACSearchClient } from "@aacsearch/sdk";

const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
  // Optional: customize configuration
  maxRetries: 3,
  requestTimeout: 30000,
  enableCache: true,
});

const results = await client.search("machine learning");
console.log(`Found ${results.count} results`);
console.log(`Cost: $${results.costDeducted}`);
```

## Configuration

```typescript
const client = new AACSearchClient({
  // Required
  apiKey: string;

  // Optional
  baseUrl?: string; // default: https://api.example.com
  maxRetries?: number; // default: 3
  requestTimeout?: number; // default: 30000 (30s)
  enableCache?: boolean; // default: true
  cacheTTL?: number; // default: 300000 (5min)

  // Advanced
  circuitBreaker?: {
    enabled: boolean; // default: true
    failureThreshold: number; // default: 5
    resetTimeout: number; // default: 60000
  };

  // Hooks
  onBeforeRequest?: (config: RequestConfig) => void;
  onAfterRequest?: (response: any) => void;
  onError?: (error: AACSearchError) => void;
  onRetry?: (attempt: number, error: Error) => void;
});
```

## API Methods

### search()

```typescript
const results = await client.search({
  query: "machine learning", // required
  limit?: 10, // optional, 1-100
  offset?: 0, // optional
  skipCache?: false, // optional
});

console.log({
  success: results.success,
  count: results.count,
  results: results.results,
  costDeducted: results.costDeducted,
  remainingBalance: results.remainingBalance,
  tokensUsed: results.tokensUsed,
});
```

### getWallet()

```typescript
const wallet = await client.getWallet();

console.log({
  balance: wallet.balance,
  currency: wallet.currency,
  totalSpent: wallet.totalSpent,
  totalEarned: wallet.totalEarned,
});
```

### getUsageStats()

```typescript
// Last 30 days (default)
const stats = await client.getUsageStats();

// Last 7 days
const stats = await client.getUsageStats(7);

console.log({
  totalCost: stats.totalCost,
  totalTokens: stats.totalTokensUsed,
  operations: stats.operations,
});
```

### getRateLimit()

```typescript
const limits = await client.getRateLimit();

console.log({
  requestsPerMinute: limits.requestsPerMinute,
  requestsPerDay: limits.requestsPerDay,
  monthlyTokenLimit: limits.monthlyTokenLimit,
});
```

### checkRateLimit()

```typescript
const allowed = await client.checkRateLimit();

if (allowed.allowed) {
  // Safe to make request
  const results = await client.search({ query: "test" });
} else {
  console.log(`Rate limited until: ${allowed.nextResetAt}`);
}
```

## Advanced Usage

### Caching Strategy

```typescript
const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
  enableCache: true,
  cacheTTL: 600000, // 10 minutes
});

// First call: hits API
const results1 = await client.search({ query: "test" });

// Second call within 10 min: returns cached result
const results2 = await client.search({ query: "test" });

// Skip cache if needed
const results3 = await client.search({
  query: "test",
  skipCache: true,
});

// Clear cache
client.clearCache();
```

### Request Queuing

```typescript
const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
});

// Queue multiple requests
const searches = [
  client.search({ query: "AI" }),
  client.search({ query: "machine learning" }),
  client.search({ query: "deep learning" }),
];

// Execute with automatic rate limit handling
const results = await Promise.all(searches);
```

### Retry Configuration

```typescript
const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
  maxRetries: 5,
  onRetry: (attempt, error) => {
    console.log(`Retry attempt ${attempt}: ${error.message}`);
  },
});

// Automatic exponential backoff on transient errors
const results = await client.search({ query: "test" });
```

### Circuit Breaker

```typescript
const client = new AACSearchClient({
  apiKey: "sk_live_xxxxx",
  circuitBreaker: {
    enabled: true,
    failureThreshold: 5, // Open after 5 failures
    resetTimeout: 60000, // Try again after 60s
  },
  onError: (error) => {
    if (error.isCircuitBreakerOpen) {
      console.error("Circuit breaker opened, service temporarily unavailable");
    }
  },
});
```

### Wallet Monitoring

```typescript
// Check balance before expensive operations
async function searchSafely(query: string) {
  const wallet = await client.getWallet();
  const estimatedCost = 0.05;

  if (wallet.balance < estimatedCost) {
    throw new Error(
      `Insufficient balance: $${wallet.balance} < $${estimatedCost}`
    );
  }

  return client.search({ query });
}

// Monitor spending
const stats = await client.getUsageStats(1);
console.log(`Spent today: $${stats.totalCost}`);
```

## Error Handling

```typescript
import {
  AACSearchError,
  AuthenticationError,
  InsufficientBalanceError,
  RateLimitError,
  ValidationError,
} from "@aacsearch/sdk";

try {
  const results = await client.search({ query: "" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error("Invalid API key");
  } else if (error instanceof InsufficientBalanceError) {
    console.error("Please add funds to your wallet");
  } else if (error instanceof RateLimitError) {
    console.error(`Rate limited until: ${error.resetAt}`);
    // Implement backoff
    await sleep(error.retryAfter);
  } else if (error instanceof ValidationError) {
    console.error(`Invalid input: ${error.message}`);
  } else if (error instanceof AACSearchError) {
    console.error(`API error: ${error.message}`);
  }
}
```

## TypeScript Interfaces

```typescript
interface AACSearchClientConfig {
  apiKey: string;
  baseUrl?: string;
  maxRetries?: number;
  requestTimeout?: number;
  enableCache?: boolean;
  cacheTTL?: number;
  circuitBreaker?: CircuitBreakerConfig;
  onBeforeRequest?: (config: RequestConfig) => void;
  onAfterRequest?: (response: any) => void;
  onError?: (error: AACSearchError) => void;
  onRetry?: (attempt: number, error: Error) => void;
}

interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  skipCache?: boolean;
}

interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  results: SearchResult[];
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
  operations: OperationStats[];
}

interface RateLimitInfo {
  requestsPerMinute: number;
  requestsPerDay: number;
  monthlyTokenLimit: number;
  concurrentRequests: number;
}
```

## Performance Tips

1. **Enable caching** for frequently searched queries
2. **Use batch operations** by queuing multiple searches
3. **Pre-flight checks** to avoid failed requests
4. **Monitor wallet balance** regularly
5. **Implement exponential backoff** for transient errors
6. **Use circuit breaker** for fault tolerance

## Support

- Documentation: https://aacsearch.com/docs
- Issues: https://github.com/aac/sdk-js/issues
- Email: support@aacsearch.com
