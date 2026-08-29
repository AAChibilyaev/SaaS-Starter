# AACSearch React SDK

Complete React integration for AACSearch - Advanced Semantic Search API.

## Features

- **Full TypeScript Support**: Complete type safety across the SDK
- **Custom Hooks**: React hooks for search, documents, usage tracking
- **Debounced Search**: Built-in debouncing for efficient API calls
- **Error Handling**: Comprehensive error handling and logging
- **Usage Tracking**: Monitor your API usage in real-time
- **Search Suggestions**: Get intelligent search suggestions

## Installation

```bash
npm install @aacsearch/react-sdk
# or
pnpm add @aacsearch/react-sdk
```

## Quick Start

### Basic Search

```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

function SearchComponent() {
  const client = new AACSearchClient({
    apiKey: "your-api-key",
  });

  const [query, setQuery] = useState("");
  const { data, loading, error } = useAACSearch(client, query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <p>Searching...</p>}
      {error && <p>Error: {error}</p>}
      {data && (
        <ul>
          {data.hits.map((hit) => (
            <li key={hit.id}>{JSON.stringify(hit)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Track Usage

```tsx
import { useAACUsage } from "@aacsearch/react-sdk";

function UsageTracker() {
  const { data, refresh } = useAACUsage(client);

  return (
    <div>
      <p>Requests: {data?.total_requests}</p>
      <p>Cost: ${data?.total_cost}</p>
      <button onClick={() => refresh()}>Refresh</button>
    </div>
  );
}
```

### Search Suggestions

```tsx
import { useAACSearchSuggestions } from "@aacsearch/react-sdk";

function SuggestionsDropdown() {
  const [query, setQuery] = useState("");
  const { suggestions } = useAACSearchSuggestions(client, query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {suggestions.map((suggestion) => (
        <div key={suggestion} onClick={() => setQuery(suggestion)}>
          {suggestion}
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### AACSearchClient

Main client for interacting with AACSearch API.

#### Constructor

```tsx
const client = new AACSearchClient({
  apiKey: "your-api-key",
  baseURL: "https://api.aacsearch.io/v1", // optional
  timeout: 30000, // optional
});
```

#### Methods

- `search(params: SearchParams): Promise<SearchResult>`
- `getCollections(): Promise<string[]>`
- `getCollection(name: string): Promise<any>`
- `getDocument(collectionName: string, documentId: string): Promise<any>`
- `getUsage(): Promise<UsageSummary>`
- `getSearchHistory(): Promise<any[]>`
- `getSearchSuggestions(query: string): Promise<string[]>`

### Hooks

#### useAACSearch

Search for documents with automatic debouncing.

```tsx
const { data, loading, error } = useAACSearch(client, query, {
  enabled: true,
  debounceMs: 300,
  collection: "documents",
  per_page: 10,
});
```

#### useAACDocument

Fetch a specific document by ID.

```tsx
const { data, loading, error } = useAACDocument(
  client,
  "collection-name",
  "document-id",
  true
);
```

#### useAACUsage

Track API usage and costs.

```tsx
const { data, loading, error, refresh } = useAACUsage(client);
```

#### useAACSearchSuggestions

Get search suggestions with debouncing.

```tsx
const { suggestions, loading, error } = useAACSearchSuggestions(
  client,
  query,
  300
);
```

## Examples

### Complete Search Component

```tsx
import React, { useState } from "react";
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

export default function SearchApp() {
  const [query, setQuery] = useState("");
  const client = new AACSearchClient({
    apiKey: process.env.REACT_APP_AAC_API_KEY,
  });

  const { data, loading, error } = useAACSearch(client, query, {
    per_page: 20,
    sort_by: "relevance",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>AACSearch Example</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents..."
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data && (
        <>
          <p>Found {data.found} results in {data.search_time_ms}ms</p>
          <div>
            {data.hits.map((hit) => (
              <div
                key={hit.id}
                style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                }}
              >
                <h3>{hit.title || hit.name}</h3>
                <p>{hit.description || hit.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

## Error Handling

All hooks and client methods include error handling:

```tsx
const { data, loading, error } = useAACSearch(client, query);

if (error) {
  console.error("Search failed:", error);
  // Handle error appropriately
}
```

## Performance Tips

1. **Use Debouncing**: All hooks come with built-in debouncing (default 300ms)
2. **Enable Conditions**: Use the `enabled` option to control when searches run
3. **Pagination**: Use `per_page` and `page` parameters to manage large datasets
4. **Caching**: Implement client-side caching for frequently searched queries

## TypeScript Support

Full TypeScript support is included:

```tsx
import type {
  SearchParams,
  SearchResult,
  UsageSummary,
} from "@aacsearch/react-sdk";

const handleSearch = async (params: SearchParams): Promise<SearchResult> => {
  // Type-safe search
};
```

## License

MIT
