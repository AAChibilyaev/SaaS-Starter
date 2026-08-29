# AACSearch SDKs

Official SDKs for AACSearch - Advanced Semantic Search Platform.

## Available SDKs

### 1. React SDK (`@aacsearch/react-sdk`)

Complete React integration with hooks and utilities for building search interfaces.

**Features:**
- React hooks for search, documents, usage tracking
- Built-in debouncing and error handling
- TypeScript support
- Zero external dependencies

**Installation:**
```bash
npm install @aacsearch/react-sdk
```

**Quick Start:**
```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

function SearchComponent() {
  const client = new AACSearchClient({ apiKey: "your-key" });
  const [query, setQuery] = useState("");
  const { data, loading } = useAACSearch(client, query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {data?.hits.map(hit => <div key={hit.id}>{hit.document.title}</div>)}
    </div>
  );
}
```

See [react-sdk/README.md](./react-sdk/README.md) for full documentation.

### 2. Shared Package (`@aacsearch/shared`)

Shared types, utilities, and interfaces used across all SDKs.

**Includes:**
- TypeScript type definitions
- API response/error interfaces
- Utility functions (formatting, validation, retries)
- Constants and enums

**Usage:**
```tsx
import type { SearchRequest, SearchResponse } from "@aacsearch/shared";
import { formatCurrency, retryAsync } from "@aacsearch/shared";
```

## SDK Architecture

```
packages/
├── shared/                    # Shared types and utilities
│   ├── src/
│   │   ├── types.ts          # Type definitions
│   │   ├── utils.ts          # Utility functions
│   │   └── index.ts          # Exports
│   └── package.json
│
└── react-sdk/                # React integration
    ├── src/
    │   ├── AACSearchClient.ts # Main client
    │   ├── hooks.ts           # React hooks
    │   └── index.ts           # Exports
    └── package.json
```

## Core Concepts

### Client Initialization

```tsx
const client = new AACSearchClient({
  apiKey: "sk_live_...",           // Required: API key from dashboard
  baseURL: "https://api.aacsearch.io/v1",  // Optional: Custom endpoint
  timeout: 30000                    // Optional: Request timeout in ms
});
```

### Search Parameters

```tsx
const params: SearchRequest = {
  q: "machine learning",           // Query string
  collection: "documents",         // Collection name
  per_page: 10,                    // Results per page
  page: 1,                         // Page number
  sort_by: "relevance",            // Sort field
  search_mode: "semantic",         // Search mode
  facets: ["category", "author"],  // Facets to include
  filter_by: "status:published"    // Filters
};
```

### Search Modes

- **prefix**: Search at the beginning of words
- **infix**: Search anywhere within words
- **exact**: Exact phrase matching
- **semantic**: AI-powered semantic search (default)

## Examples

### 1. Basic Search

```tsx
import { useState } from "react";
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

export function SearchDemo() {
  const client = new AACSearchClient({ apiKey: process.env.REACT_APP_AAC_KEY });
  const [query, setQuery] = useState("");
  const { data, loading, error } = useAACSearch(client, query);

  return (
    <div>
      <input 
        placeholder="Search..." 
        value={query} 
        onChange={e => setQuery(e.target.value)} 
      />
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {data?.hits.map(hit => (
          <li key={hit.id}>{hit.document.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 2. Advanced Search with Filters

```tsx
const { data } = useAACSearch(client, query, {
  collection: "products",
  per_page: 20,
  sort_by: "-created_at",  // Newest first
  filter_by: "category:electronics AND price < 100",
  facets: ["brand", "category", "price_range"],
  search_mode: "semantic"
});

// Access facet counts
data?.facet_counts.forEach(facet => {
  console.log(`${facet.field_name}:`, facet.counts);
});
```

### 3. Real-time Suggestions

```tsx
import { useAACSearchSuggestions } from "@aacsearch/react-sdk";

function SearchSuggest() {
  const [query, setQuery] = useState("");
  const { suggestions } = useAACSearchSuggestions(client, query);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {suggestions.map(suggestion => (
          <li key={suggestion} onClick={() => setQuery(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Usage Monitoring

```tsx
import { useAACUsage } from "@aacsearch/react-sdk";
import { formatCurrency } from "@aacsearch/shared";

function UsageDashboard() {
  const { data: usage, refresh } = useAACUsage(client);

  return (
    <div>
      <p>Total Requests: {usage?.total_requests}</p>
      <p>Total Cost: {formatCurrency(usage?.total_cost || 0)}</p>
      <p>Remaining: {usage?.requests_remaining}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## API Reference

### Hooks

#### useAACSearch(client, query, options?)

Search with automatic debouncing.

```tsx
interface UseAACSearchOptions {
  enabled?: boolean;           // Enable/disable search
  debounceMs?: number;         // Debounce delay (default: 300)
  collection?: string;         // Collection name
  per_page?: number;           // Results per page
  page?: number;               // Page number
  sort_by?: string;            // Sort field
  facets?: string[];           // Facets
  filter_by?: string;          // Filters
  search_mode?: SearchMode;    // Search mode
}

const { data, loading, error } = useAACSearch(client, query, options);
```

#### useAACDocument(client, collection, documentId, enabled?)

Fetch a specific document.

```tsx
const { data, loading, error } = useAACDocument(
  client,
  "products",
  "doc-123",
  true
);
```

#### useAACUsage(client)

Monitor API usage.

```tsx
const { data, loading, error, refresh } = useAACUsage(client);
```

#### useAACSearchSuggestions(client, query, debounceMs?)

Get search suggestions.

```tsx
const { suggestions, loading, error } = useAACSearchSuggestions(
  client,
  query,
  300
);
```

## Error Handling

All SDKs provide consistent error handling:

```tsx
const { data, loading, error } = useAACSearch(client, query);

if (error) {
  if (error.includes("401")) {
    // Authentication error - refresh API key
  } else if (error.includes("429")) {
    // Rate limit - implement backoff
  } else {
    // Other error
    console.error(error);
  }
}
```

## Rate Limiting

The SDK respects rate limits:
- Free tier: 100 requests/hour
- Starter: 10,000 requests/month
- Pro: Unlimited

When rate limit is exceeded, the client returns HTTP 429. Implement exponential backoff:

```tsx
import { retryAsync } from "@aacsearch/shared";

const result = await retryAsync(
  () => client.search(params),
  { retries: 3, backoff: true }
);
```

## Best Practices

1. **Reuse Client Instance**: Create once, use throughout app
   ```tsx
   const client = useMemo(() => new AACSearchClient({ apiKey }), []);
   ```

2. **Implement Caching**: Cache search results
   ```tsx
   const cache = useRef<Map<string, SearchResponse>>(new Map());
   ```

3. **Handle Loading States**: Provide feedback to users
   ```tsx
   {loading && <Spinner />}
   {error && <ErrorMessage error={error} />}
   {data && <ResultsList results={data.hits} />}
   ```

4. **Optimize Debouncing**: Balance responsiveness vs API calls
   ```tsx
   useAACSearch(client, query, { debounceMs: 500 })
   ```

5. **Monitor Usage**: Track costs and quotas
   ```tsx
   const { data: usage } = useAACUsage(client);
   if (usage && usage.requests_remaining < 100) {
     showWarning("Low API quota remaining");
   }
   ```

## Roadmap

### v1.1 (Q1 2024)
- Vue.js SDK
- Angular SDK
- GraphQL client

### v1.2 (Q2 2024)
- Offline mode with sync
- Analytics integration
- Custom caching strategies

### v2.0 (Q3 2024)
- Real-time subscriptions
- AI-powered filters
- Advanced aggregations

## Support

- **Documentation**: https://docs.aacsearch.io
- **GitHub Issues**: https://github.com/AAChibilyaev/aacsearch
- **Discord**: https://discord.gg/aacsearch
- **Email**: support@aacsearch.io

## License

MIT License - See LICENSE file for details
