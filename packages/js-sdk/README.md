# AACSearch JavaScript/TypeScript SDK

Complete JavaScript/TypeScript SDK for AACSearch - Advanced Semantic Search API.

Works in Node.js, Deno, and modern browsers.

## Features

- **Full TypeScript Support**: Complete type safety with detailed interfaces
- **Lightweight**: No external dependencies (except node-fetch for Node.js)
- **Universal**: Works in Node.js, browsers, and Deno
- **Error Handling**: Custom error classes with specific error checks
- **Async/Await**: Modern async API
- **ESM & CommonJS**: Dual module support

## Installation

### npm

```bash
npm install @aacsearch/sdk
```

### yarn

```bash
yarn add @aacsearch/sdk
```

### pnpm

```bash
pnpm add @aacsearch/sdk
```

## Quick Start

### Node.js

```javascript
const { AACSearchClient } = require("@aacsearch/sdk");

const client = new AACSearchClient({
  apiKey: "sk_live_your-api-key",
});

async function search() {
  try {
    const results = await client.search({
      q: "machine learning",
      collection: "documents",
      per_page: 10,
    });

    console.log(`Found ${results.found} results`);
    results.hits.forEach((hit) => {
      console.log(hit.document.title);
    });
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}

search();
```

### ES Modules

```typescript
import { AACSearchClient } from "@aacsearch/sdk";

const client = new AACSearchClient({
  apiKey: "sk_live_your-api-key",
});

const results = await client.search({
  q: "artificial intelligence",
  collection: "articles",
});
```

### Browser (UMD)

```html
<script src="https://cdn.jsdelivr.net/npm/@aacsearch/sdk"></script>
<script>
  const client = new AACSearch.AACSearchClient({
    apiKey: "sk_live_your-api-key",
  });

  client
    .search({ q: "search query" })
    .then((results) => console.log(results))
    .catch((error) => console.error(error));
</script>
```

## API Reference

### Constructor

```typescript
const client = new AACSearchClient({
  apiKey: "sk_live_...",              // Required
  baseURL: "https://api.aacsearch.io/v1",  // Optional
  timeout: 30000,                      // Optional, in milliseconds
});
```

### Methods

#### search(params)

```typescript
const results = await client.search({
  q: "search query",           // Required
  collection: "documents",     // Optional
  per_page: 10,                // Optional
  page: 1,                     // Optional
  sort_by: "relevance",        // Optional
  search_mode: "semantic",     // Optional: prefix|infix|exact|semantic
  facets: ["category"],        // Optional
  filter_by: "status:active",  // Optional
});

// Response
{
  hits: [
    {
      id: "doc-1",
      document: { title: "...", content: "..." },
      text_match: 95,
    },
  ],
  found: 1234,
  out_of: 1234,
  page: 1,
  search_time_ms: 45,
}
```

#### getCollections()

```typescript
const collections = await client.getCollections();
// ["documents", "articles", "products"]
```

#### getCollection(name)

```typescript
const collection = await client.getCollection("documents");
// {
//   name: "documents",
//   num_documents: 1234,
//   fields: [...]
// }
```

#### getDocument(collection, documentId)

```typescript
const document = await client.getDocument("documents", "doc-123");
// { id: "doc-123", title: "...", content: "..." }
```

#### getUsage()

```typescript
const usage = await client.getUsage();
// {
//   total_requests: 1000,
//   total_tokens: 50000,
//   total_cost: 12.50,
//   requests_remaining: 9000,
// }
```

#### getSearchHistory(params?)

```typescript
const history = await client.getSearchHistory({
  limit: 10,
  offset: 0,
});
// [{ query: "...", results_count: 45, searched_at: "2024-01-15T..." }, ...]
```

#### getSearchSuggestions(query)

```typescript
const suggestions = await client.getSearchSuggestions("mach");
// ["machine learning", "machinery", "machine vision"]
```

## Error Handling

```typescript
import { AACSearchClient, AACSearchError } from "@aacsearch/sdk";

const client = new AACSearchClient({ apiKey: "sk_live_..." });

try {
  const results = await client.search({ q: "query" });
} catch (error) {
  if (error instanceof AACSearchError) {
    if (error.isAuthenticationError()) {
      console.error("Invalid API key");
    } else if (error.isRateLimitError()) {
      console.error("Rate limit exceeded - wait before retrying");
    } else if (error.isNotFoundError()) {
      console.error("Resource not found");
    } else {
      console.error(`Error (${error.code}): ${error.message}`);
    }
  }
}
```

## Advanced Usage

### Retry Logic

```typescript
async function searchWithRetry(query: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await client.search({ q: query });
    } catch (error) {
      if (
        error instanceof AACSearchError &&
        error.isRateLimitError() &&
        i < maxRetries - 1
      ) {
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
}
```

### Batch Requests

```typescript
async function batchSearch(queries: string[]) {
  const results = await Promise.all(
    queries.map((q) => client.search({ q }))
  );
  return results;
}

const results = await batchSearch([
  "machine learning",
  "artificial intelligence",
  "data science",
]);
```

### Search with Caching

```typescript
class CachedSearchClient {
  private cache = new Map<string, any>();
  private ttl = 3600000; // 1 hour

  constructor(private client: AACSearchClient) {}

  async search(params: SearchParams) {
    const key = JSON.stringify(params);

    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const results = await this.client.search(params);
    this.cache.set(key, results);

    // Clear cache after TTL
    setTimeout(() => this.cache.delete(key), this.ttl);

    return results;
  }
}
```

### Monitoring Usage

```typescript
async function checkUsageAndAlert() {
  const usage = await client.getUsage();

  if (usage.requests_remaining < 100) {
    console.warn(
      "Low API quota:",
      usage.requests_remaining,
      "requests remaining"
    );
  }

  if (usage.total_cost > 100) {
    console.warn("High cost:", usage.total_cost);
  }
}
```

## Environment Variables

```bash
# .env
AACSEARCH_API_KEY=sk_live_your-api-key
AACSEARCH_BASE_URL=https://api.aacsearch.io/v1
AACSEARCH_TIMEOUT=30000
```

```typescript
const client = new AACSearchClient({
  apiKey: process.env.AACSEARCH_API_KEY!,
  baseURL: process.env.AACSEARCH_BASE_URL,
  timeout: parseInt(process.env.AACSEARCH_TIMEOUT || "30000"),
});
```

## TypeScript Support

Full TypeScript support with detailed type definitions:

```typescript
import {
  AACSearchClient,
  SearchParams,
  SearchResponse,
  SearchHistory,
  UsageMetrics,
} from "@aacsearch/sdk";

async function typedSearch(
  client: AACSearchClient,
  query: string
): Promise<SearchResponse> {
  const params: SearchParams = {
    q: query,
    collection: "documents",
    per_page: 20,
  };

  return client.search(params);
}
```

## Best Practices

1. **Store API Key Securely**
   ```typescript
   // Use environment variables
   const apiKey = process.env.AACSEARCH_API_KEY;
   ```

2. **Handle Errors Gracefully**
   ```typescript
   try {
     const results = await client.search({ q });
   } catch (error) {
     // Log and handle appropriately
     logger.error("Search failed", error);
     return { hits: [], found: 0 };
   }
   ```

3. **Implement Rate Limit Handling**
   ```typescript
   if (error instanceof AACSearchError && error.isRateLimitError()) {
     // Implement exponential backoff
   }
   ```

4. **Cache Frequently Accessed Data**
   ```typescript
   // Cache collection metadata
   const collections = await client.getCollections();
   ```

5. **Monitor Usage and Costs**
   ```typescript
   const usage = await client.getUsage();
   if (usage.total_cost > budget) {
     // Alert or throttle requests
   }
   ```

## Browser Support

- Chrome 90+
- Firefox 89+
- Safari 15+
- Edge 90+

Uses native `fetch` API (Fetch API polyfill required for older browsers).

## Node.js Version

- Node.js 14.0+
- Uses native `fetch` if available (Node.js 18+)
- Uses `node-fetch` polyfill for older versions

## Contributing

Contributions welcome! Please submit issues and PRs to:
https://github.com/AAChibilyaev/aacsearch

## Support

- **Documentation**: https://docs.aacsearch.io
- **GitHub Issues**: https://github.com/AAChibilyaev/aacsearch/issues
- **Email**: support@aacsearch.io

## License

MIT License - See LICENSE file for details
