# AACSearch React SDK

Advanced React hooks for integrating AACSearch API v1. Includes built-in state management, caching, suspense support, and real-time wallet tracking.

## Features

- ✅ React 18+ hooks for search, wallet, usage monitoring
- ✅ Suspense and error boundary support
- ✅ Automatic caching with stale-while-revalidate
- ✅ Real-time wallet balance tracking
- ✅ Built-in loading and error states
- ✅ Request deduplication
- ✅ Optimistic updates
- ✅ TypeScript first
- ✅ Zero external dependencies (besides React)

## Installation

```bash
npm install @aacsearch/react-sdk react@18+
```

## Quick Start

```typescript
import { AACSearchProvider, useSearch, useWallet } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <SearchComponent />
    </AACSearchProvider>
  );
}

function SearchComponent() {
  const { search, results, loading, error } = useSearch();

  return (
    <div>
      <button onClick={() => search("machine learning")}>Search</button>
      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Hooks

### useSearch()

```typescript
const {
  results,
  loading,
  error,
  search,
  clear,
  query,
  count,
  costDeducted,
  remainingBalance,
  tokensUsed,
} = useSearch({
  onSuccess?: (results) => void;
  onError?: (error) => void;
  skipCache?: false;
});

// Usage
await search("machine learning", { limit: 20 });
```

### useWallet()

```typescript
const { wallet, loading, error, refresh } = useWallet({
  refreshInterval?: 30000; // Auto-refresh every 30s
});

console.log(wallet.balance);
console.log(wallet.totalSpent);
```

### useUsageStats()

```typescript
const { stats, loading, error, days, setDays } = useUsageStats({
  initialDays?: 30;
  refreshInterval?: 60000;
});

console.log(`Spent: $${stats.totalCost}`);
console.log(`Tokens: ${stats.totalTokensUsed}`);
```

### useRateLimit()

```typescript
const { limits, allowed, loading, check } = useRateLimit({
  autoCheck?: true;
  checkInterval?: 5000;
});

if (allowed) {
  // Safe to perform search
}
```

### useAACSearch()

Context hook for accessing the client directly:

```typescript
const client = useAACSearch();

const results = await client.search({ query: "test" });
```

## Components

### SearchInput

```typescript
import { SearchInput } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <SearchInput onResults={(results) => console.log(results)} />
    </AACSearchProvider>
  );
}
```

### SearchResults

```typescript
import { SearchResults } from "@aacsearch/react-sdk";

function App() {
  const { results, loading } = useSearch();

  return (
    <SearchResults
      results={results}
      loading={loading}
      onResultClick={(result) => console.log(result)}
    />
  );
}
```

### WalletDisplay

```typescript
import { WalletDisplay } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <WalletDisplay showHistory />
    </AACSearchProvider>
  );
}
```

### UsageChart

```typescript
import { UsageChart } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <UsageChart days={30} type="cost" />
    </AACSearchProvider>
  );
}
```

## Advanced Usage

### Search with Auto-Debounce

```typescript
import { useSearchDebounced } from "@aacsearch/react-sdk";

function SearchComponent() {
  const { search, results, loading } = useSearchDebounced({
    debounceMs: 300,
    minChars: 2,
  });

  return (
    <>
      <input onChange={(e) => search(e.target.value)} />
      {loading && <div>Searching...</div>}
      {results.map((r) => (
        <div key={r.id}>{r.title}</div>
      ))}
    </>
  );
}
```

### Pagination

```typescript
function SearchWithPagination() {
  const { search, results, count } = useSearch();
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleSearch = (query: string) => {
    search(query, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
  };

  const totalPages = Math.ceil(count / pageSize);

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <div>{results.map((r) => ...)}</div>
      <div>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
}
```

### Real-time Balance Monitoring

```typescript
function BalanceMonitor() {
  const wallet = useWallet({ refreshInterval: 10000 });
  const lowBalance = wallet.balance < 5;

  return (
    <div className={lowBalance ? "alert" : ""}>
      <p>Balance: ${wallet.balance.toFixed(2)}</p>
      {lowBalance && <p>⚠️ Add funds soon</p>}
    </div>
  );
}
```

### Search History

```typescript
function SearchHistoryComponent() {
  const { history, addToHistory, clearHistory } = useSearchHistory();

  return (
    <div>
      <h3>Recent Searches</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.query} - ${item.cost}
          </li>
        ))}
      </ul>
      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### Error Boundary

```typescript
import { AACSearchErrorBoundary } from "@aacsearch/react-sdk";

function App() {
  return (
    <AACSearchErrorBoundary fallback={<ErrorFallback />}>
      <AACSearchProvider apiKey="sk_live_xxxxx">
        <SearchComponent />
      </AACSearchProvider>
    </AACSearchErrorBoundary>
  );
}
```

### Suspense Support

```typescript
import { Suspense } from "react";

function App() {
  return (
    <AACSearchProvider apiKey="sk_live_xxxxx">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchComponent />
      </Suspense>
    </AACSearchProvider>
  );
}
```

## TypeScript Interfaces

```typescript
interface UseSearchOptions {
  onSuccess?: (results: SearchResponse) => void;
  onError?: (error: AACSearchError) => void;
  skipCache?: boolean;
}

interface UseSearchReturn {
  results: SearchResult[];
  loading: boolean;
  error: AACSearchError | null;
  search: (query: string, options?: SearchOptions) => Promise<void>;
  clear: () => void;
  query: string;
  count: number;
  costDeducted: number;
  remainingBalance: number;
  tokensUsed: number;
}

interface UseWalletOptions {
  refreshInterval?: number;
}

interface UseWalletReturn {
  wallet: WalletInfo | null;
  loading: boolean;
  error: AACSearchError | null;
  refresh: () => Promise<void>;
}

interface UseRateLimitOptions {
  autoCheck?: boolean;
  checkInterval?: number;
}

interface UseRateLimitReturn {
  limits: RateLimitInfo | null;
  allowed: boolean;
  loading: boolean;
  check: () => Promise<RateLimitCheckResponse>;
}
```

## Performance Optimization

### Prevent Unnecessary Re-renders

```typescript
const memoizedResults = useMemo(() => results, [results]);

return (
  <SearchResultsList results={memoizedResults} />
);
```

### Lazy Load Results

```typescript
const { search, results } = useSearch();
const [displayedResults, setDisplayedResults] = useState<SearchResult[]>([]);

const loadMore = () => {
  setDisplayedResults((prev) => [
    ...prev,
    ...results.slice(prev.length, prev.length + 10),
  ]);
};
```

## Examples

See `/examples` for complete React applications:
- Search UI with results
- Wallet dashboard
- Usage analytics
- API explorer

## Support

- Documentation: https://aacsearch.com/docs/react
- GitHub: https://github.com/aac/sdk-react
- Email: support@aacsearch.com
