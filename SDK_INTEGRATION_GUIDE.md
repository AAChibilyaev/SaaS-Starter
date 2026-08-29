# AACSearch SDK Integration Guide

Complete guide for integrating AACSearch SDKs into your applications.

## 📦 Available SDKs

### 1. React SDK (`@aacsearch/react-sdk`)
Modern React integration with hooks and components.

**Use when:** Building React applications with semantic search.

**Installation:**
```bash
npm install @aacsearch/react-sdk
```

**Quick Start:**
```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

function SearchApp() {
  const client = new AACSearchClient({ apiKey: "sk_live_..." });
  const [query, setQuery] = useState("");
  const { data, loading } = useAACSearch(client, query);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {data?.hits.map((hit) => (
        <div key={hit.id}>{hit.document.title}</div>
      ))}
    </div>
  );
}
```

**Features:**
- React hooks (useAACSearch, useAACDocument, useAACUsage)
- Built-in debouncing
- Error handling
- Zero dependencies
- Full TypeScript support

See: [packages/react-sdk/README.md](./packages/react-sdk/README.md)

---

### 2. JavaScript/TypeScript SDK (`@aacsearch/sdk`)
Universal SDK for Node.js and browsers.

**Use when:** Building vanilla JavaScript apps, Node.js backends, or Deno.

**Installation:**
```bash
npm install @aacsearch/sdk
```

**Quick Start (Node.js):**
```javascript
const { AACSearchClient } = require("@aacsearch/sdk");

const client = new AACSearchClient({ apiKey: "sk_live_..." });

async function search() {
  const results = await client.search({ q: "machine learning" });
  console.log(`Found ${results.found} results`);
}

search();
```

**Quick Start (Browser):**
```html
<script src="https://cdn.jsdelivr.net/npm/@aacsearch/sdk"></script>
<script>
  const client = new AACSearch.AACSearchClient({
    apiKey: "sk_live_...",
  });

  client
    .search({ q: "query" })
    .then((results) => console.log(results))
    .catch((error) => console.error(error));
</script>
```

**Features:**
- Works in Node.js, browsers, Deno
- Full TypeScript support
- ESM & CommonJS
- No dependencies
- Error handling with AACSearchError

See: [packages/js-sdk/README.md](./packages/js-sdk/README.md)

---

### 3. PHP SDK (`aacsearch/php-sdk`)
Complete PHP integration for Laravel and standalone PHP.

**Use when:** Building PHP backends or Laravel applications.

**Installation:**
```bash
composer require aacsearch/php-sdk
```

**Quick Start (Standalone):**
```php
<?php

require 'vendor/autoload.php';

use AACSearch\Client;

$client = new Client([
    'apiKey' => 'sk_live_...',
]);

$results = $client->search([
    'q' => 'machine learning',
    'per_page' => 10,
]);

echo "Found: " . $results['found'] . " results\n";
```

**Quick Start (Laravel):**
```php
// Publish config
php artisan vendor:publish --provider="AACSearch\Laravel\AACSearchServiceProvider"

// Set env
// .env
AACSEARCH_API_KEY=sk_live_...

// Use in controller
<?php

namespace App\Http\Controllers;

use AACSearch\Client;

class SearchController extends Controller
{
    public function search(Client $client)
    {
        return $client->search(['q' => 'query']);
    }
}
```

**Features:**
- Laravel service provider
- Error handling
- PSR-16 cache support
- Guzzle HTTP client
- Full PHP 8.0+ support

See: [packages/php-sdk/README.md](./packages/php-sdk/README.md)

---

### 4. Shared Package (`@aacsearch/shared`)
Type definitions and utilities for all SDKs.

**Use when:** Building SDK extensions or shared utilities.

**Installation:**
```bash
npm install @aacsearch/shared
```

**Usage:**
```typescript
import type { SearchRequest, SearchResponse } from "@aacsearch/shared";
import { formatCurrency, retryAsync } from "@aacsearch/shared";

const request: SearchRequest = {
  q: "query",
  collection: "documents",
};

const cost = formatCurrency(12.50, "USD"); // "$12.50"
```

See: [packages/shared/README.md](./packages/shared/README.md)

---

## 🔑 Getting Started

### 1. Get API Key

1. Sign up at https://aacsearch.io
2. Go to Dashboard → API Keys
3. Click "Generate Key"
4. Copy the key (starts with `sk_live_`)

### 2. Install SDK

Choose your SDK based on your platform:
- React app → React SDK
- Node.js backend → JavaScript SDK
- PHP application → PHP SDK
- Vanilla JS → JavaScript SDK

### 3. Initialize Client

```typescript
// React
const client = new AACSearchClient({ apiKey: "sk_live_..." });

// JavaScript
const client = new AACSearchClient({ apiKey: "sk_live_..." });

// PHP
$client = new Client(['apiKey' => 'sk_live_...']);
```

### 4. Start Searching

```typescript
// React
const { data } = useAACSearch(client, "query");

// JavaScript
const results = await client.search({ q: "query" });

// PHP
$results = $client->search(['q' => 'query']);
```

---

## 🎯 Common Use Cases

### Use Case 1: Website Search Bar

**React Implementation:**
```tsx
import { AACSearchClient, useAACSearch } from "@aacsearch/react-sdk";

function SearchBar() {
  const client = new AACSearchClient({ apiKey: process.env.REACT_APP_API_KEY });
  const [query, setQuery] = useState("");
  const { data, loading } = useAACSearch(client, query, { per_page: 5 });

  return (
    <div>
      <input
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && <p>Searching...</p>}
      <ul>
        {data?.hits.map((hit) => (
          <li key={hit.id}>{hit.document.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

**PHP Implementation:**
```php
<?php

use AACSearch\Client;

$client = new Client(['apiKey' => env('AACSEARCH_API_KEY')]);

$query = $_GET['q'] ?? '';
$results = $client->search([
    'q' => $query,
    'per_page' => 5,
]);

header('Content-Type: application/json');
echo json_encode($results);
```

---

### Use Case 2: Backend Search API

**Node.js Implementation:**
```javascript
const express = require("express");
const { AACSearchClient } = require("@aacsearch/sdk");

const app = express();
const client = new AACSearchClient({ apiKey: process.env.AACSEARCH_API_KEY });

app.get("/api/search", async (req, res) => {
  try {
    const results = await client.search({
      q: req.query.q,
      per_page: req.query.per_page || 20,
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3001);
```

**PHP Implementation:**
```php
<?php

use AACSearch\Client;

$client = new Client(['apiKey' => $_ENV['AACSEARCH_API_KEY']]);

try {
    $results = $client->search([
        'q' => $_GET['q'] ?? '',
        'per_page' => $_GET['per_page'] ?? 20,
    ]);
    
    header('Content-Type: application/json');
    echo json_encode($results);
} catch (\AACSearch\AACSearchException $e) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => $e->getMessage()]);
}
```

---

### Use Case 3: Monitor Usage & Costs

**React Implementation:**
```tsx
import { useAACUsage } from "@aacsearch/react-sdk";
import { formatCurrency } from "@aacsearch/shared";

function UsageDashboard() {
  const { data: usage } = useAACUsage(client);

  if (!usage) return <div>Loading...</div>;

  return (
    <div>
      <p>Total Requests: {usage.total_requests}</p>
      <p>Total Cost: {formatCurrency(usage.total_cost)}</p>
      <p>Remaining: {usage.requests_remaining}</p>
      {usage.requests_remaining < 100 && (
        <warning>⚠️ Low quota remaining</warning>
      )}
    </div>
  );
}
```

**JavaScript Implementation:**
```javascript
const usage = await client.getUsage();

console.log(`Total Cost: $${usage.total_cost}`);
console.log(`Requests Remaining: ${usage.requests_remaining}`);

if (usage.total_cost > 100) {
  console.warn("High costs - consider reviewing search patterns");
}
```

---

### Use Case 4: Batch Processing

**JavaScript Implementation:**
```javascript
async function batchSearch(queries) {
  const results = await Promise.all(
    queries.map((q) => client.search({ q }))
  );
  return results;
}

const queries = ["AI", "Machine Learning", "Deep Learning"];
const allResults = await batchSearch(queries);
```

**PHP Implementation:**
```php
<?php

$queries = ['AI', 'Machine Learning', 'Deep Learning'];
$results = [];

foreach ($queries as $query) {
    $results[$query] = $client->search(['q' => $query]);
}

echo json_encode($results);
```

---

## 🛠️ Error Handling

### React SDK
```tsx
const { data, error, loading } = useAACSearch(client, query);

if (error) {
  return <ErrorMessage error={error} />;
}
```

### JavaScript SDK
```javascript
try {
  const results = await client.search({ q: "query" });
} catch (error) {
  if (error.isAuthenticationError()) {
    console.error("Invalid API key");
  } else if (error.isRateLimitError()) {
    console.error("Rate limited");
  } else {
    console.error("Error:", error.message);
  }
}
```

### PHP SDK
```php
try {
    $results = $client->search(['q' => 'query']);
} catch (\AACSearch\AACSearchException $e) {
    if ($e->isAuthenticationError()) {
        echo "Invalid API key";
    } elseif ($e->isRateLimitError()) {
        echo "Rate limited";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
```

---

## 🚀 Best Practices

### 1. Store API Keys Securely
```bash
# Use environment variables
AACSEARCH_API_KEY=sk_live_your_key
```

### 2. Handle Rate Limits
```typescript
// Implement exponential backoff
if (error.isRateLimitError()) {
  await new Promise((r) => setTimeout(r, 1000 * (retries + 1)));
  // Retry
}
```

### 3. Cache Results
```typescript
// Cache frequently accessed data
const collections = await client.getCollections(); // Cache this
```

### 4. Monitor Costs
```typescript
const usage = await client.getUsage();
if (usage.total_cost > budget) {
  // Alert or throttle
}
```

### 5. Handle Errors Gracefully
```typescript
try {
  return await client.search({ q });
} catch (error) {
  logger.error("Search failed", error);
  return { hits: [], found: 0 }; // Fallback
}
```

---

## 📚 Documentation Links

- [React SDK Docs](./packages/react-sdk/README.md)
- [JavaScript SDK Docs](./packages/js-sdk/README.md)
- [PHP SDK Docs](./packages/php-sdk/README.md)
- [Shared Package Docs](./packages/shared/README.md)
- [Platform Docs](./AACSEARCH.md)
- [API Reference](/api-docs)

---

## 🆘 Troubleshooting

### "Invalid API Key"
- Check your API key format (should start with `sk_live_`)
- Verify the key is correctly set in environment variables
- Ensure the key hasn't expired or been revoked

### "Rate Limit Exceeded"
- Implement exponential backoff
- Consider caching results
- Check your plan limits

### "Collection Not Found"
- Verify the collection name is correct
- Use `getCollections()` to list available collections

### Network Timeouts
- Increase timeout in client config
- Check your network connection
- Verify the API endpoint is accessible

---

## 📞 Support

Need help? Contact us:
- **Email**: support@aacsearch.io
- **GitHub**: https://github.com/AAChibilyaev/aacsearch
- **Discord**: https://discord.gg/aacsearch
- **Docs**: https://docs.aacsearch.io
