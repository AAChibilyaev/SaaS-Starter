# Integration Examples

Real-world examples of integrating the SaaS Search API in different environments.

## cURL

### Basic Search

```bash
curl -X GET "https://api.example.com/api/v1/search?q=machine%20learning&limit=10" \
  -H "Authorization: Bearer sk_live_xxxxx" \
  -H "Content-Type: application/json"
```

### Get Wallet

```bash
curl -X GET "https://api.example.com/api/v1/wallet" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

### Get Usage Stats

```bash
curl -X GET "https://api.example.com/api/v1/usage?days=7" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

### Check Rate Limit

```bash
curl -X POST "https://api.example.com/api/v1/rate-limit" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

## JavaScript / Node.js

### Using Fetch API

```javascript
const apiKey = "sk_live_xxxxx";
const baseUrl = "https://api.example.com";

async function search(query, limit = 10) {
  const response = await fetch(
    `${baseUrl}/api/v1/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Search failed: ${error.error}`);
  }

  return response.json();
}

// Usage
search("machine learning").then((results) => {
  console.log(`Found ${results.count} results`);
  console.log(`Cost: $${results.costDeducted}`);
  console.log(`Balance: $${results.remainingBalance}`);
  results.results.forEach((result) => {
    console.log(`- ${result.title}`);
  });
});
```

### Using Axios

```javascript
import axios from "axios";

const client = axios.create({
  baseURL: "https://api.example.com",
  headers: {
    Authorization: `Bearer sk_live_xxxxx`,
  },
});

async function search(query, limit = 10) {
  try {
    const { data } = await client.get("/api/v1/search", {
      params: { q: query, limit },
    });
    return data;
  } catch (error) {
    if (error.response?.status === 402) {
      console.error("Insufficient balance");
    } else if (error.response?.status === 429) {
      console.error("Rate limit exceeded");
    }
    throw error;
  }
}
```

### React Hook

```typescript
import { useState, useCallback } from "react";

const useSearch = (apiKey: string) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [costInfo, setCostInfo] = useState({
    costDeducted: 0,
    remainingBalance: 0,
  });

  const search = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.example.com/api/v1/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error);
        }

        const data = await response.json();
        setResults(data.results);
        setCostInfo({
          costDeducted: data.costDeducted,
          remainingBalance: data.remainingBalance,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setLoading(false);
      }
    },
    [apiKey]
  );

  return { results, loading, error, search, costInfo };
};

// Usage in component
export function SearchComponent() {
  const { results, loading, search, costInfo } = useSearch("sk_live_xxxxx");

  return (
    <div>
      <input
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            search(e.currentTarget.value);
          }
        }}
        placeholder="Search..."
      />

      {loading && <p>Searching...</p>}

      <div className="cost-info">
        <p>Balance: ${costInfo.remainingBalance.toFixed(2)}</p>
      </div>

      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Python

### Using Requests

```python
import requests
import json

API_KEY = "sk_live_xxxxx"
BASE_URL = "https://api.example.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

def search(query, limit=10):
    """Perform a search query"""
    params = {"q": query, "limit": limit}
    response = requests.get(
        f"{BASE_URL}/api/v1/search",
        params=params,
        headers=headers,
    )
    response.raise_for_status()
    return response.json()

def get_wallet():
    """Get current wallet info"""
    response = requests.get(
        f"{BASE_URL}/api/v1/wallet",
        headers=headers,
    )
    response.raise_for_status()
    return response.json()

def get_usage_stats(days=30):
    """Get usage statistics"""
    params = {"days": days}
    response = requests.get(
        f"{BASE_URL}/api/v1/usage",
        params=params,
        headers=headers,
    )
    response.raise_for_status()
    return response.json()

# Usage
try:
    results = search("machine learning")
    print(f"Found {results['count']} results")
    print(f"Cost deducted: ${results['costDeducted']}")
    print(f"Remaining balance: ${results['remainingBalance']}")

    for result in results["results"]:
        print(f"- {result['title']}")

except requests.exceptions.HTTPError as e:
    if e.response.status_code == 402:
        print("Insufficient balance")
    elif e.response.status_code == 429:
        print("Rate limit exceeded")
    else:
        print(f"Error: {e.response.json()['error']}")
```

### Using AIOHTTP (Async)

```python
import aiohttp
import asyncio

API_KEY = "sk_live_xxxxx"
BASE_URL = "https://api.example.com"

async def search(query, limit=10):
    """Perform an async search"""
    headers = {"Authorization": f"Bearer {API_KEY}"}
    params = {"q": query, "limit": limit}

    async with aiohttp.ClientSession() as session:
        async with session.get(
            f"{BASE_URL}/api/v1/search",
            params=params,
            headers=headers,
        ) as response:
            if response.status == 402:
                raise Exception("Insufficient balance")
            if response.status == 429:
                raise Exception("Rate limit exceeded")

            return await response.json()

async def main():
    results = await search("machine learning")
    print(f"Found {results['count']} results")

asyncio.run(main())
```

## Go

### Basic Client

```go
package main

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

const (
	apiKey  = "sk_live_xxxxx"
	baseURL = "https://api.example.com"
)

type SearchResponse struct {
	Success          bool        `json:"success"`
	Query            string      `json:"query"`
	Count            int         `json:"count"`
	Results          []Result    `json:"results"`
	CostDeducted     float64     `json:"costDeducted"`
	RemainingBalance float64     `json:"remainingBalance"`
	TokensUsed       int         `json:"tokensUsed"`
}

type Result struct {
	ID      string  `json:"id"`
	Title   string  `json:"title"`
	Excerpt string  `json:"excerpt"`
	Score   float64 `json:"score"`
}

func search(query string, limit int) (*SearchResponse, error) {
	params := url.Values{}
	params.Set("q", query)
	params.Set("limit", fmt.Sprintf("%d", limit))

	req, err := http.NewRequest(
		"GET",
		fmt.Sprintf("%s/api/v1/search?%s", baseURL, params.Encode()),
		nil,
	)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", apiKey))

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error: %s", string(body))
	}

	var result SearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result, nil
}

func main() {
	results, err := search("machine learning", 10)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}

	fmt.Printf("Found %d results\n", results.Count)
	fmt.Printf("Cost: $%.4f\n", results.CostDeducted)
	fmt.Printf("Balance: $%.2f\n", results.RemainingBalance)

	for _, result := range results.Results {
		fmt.Printf("- %s\n", result.Title)
	}
}
```

## Ruby

### Using Net::HTTP

```ruby
require 'net/http'
require 'json'

API_KEY = "sk_live_xxxxx"
BASE_URL = "https://api.example.com"

def search(query, limit = 10)
  uri = URI("#{BASE_URL}/api/v1/search")
  uri.query = URI.encode_www_form(q: query, limit: limit)

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = "Bearer #{API_KEY}"

  response = http.request(request)
  JSON.parse(response.body)
end

def get_wallet
  uri = URI("#{BASE_URL}/api/v1/wallet")

  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = "Bearer #{API_KEY}"

  response = http.request(request)
  JSON.parse(response.body)
end

# Usage
results = search("machine learning")
puts "Found #{results['count']} results"
puts "Cost: $#{results['costDeducted']}"
puts "Balance: $#{results['remainingBalance']}"

results['results'].each do |result|
  puts "- #{result['title']}"
end
```

## PHP

### Using cURL

```php
<?php

class SaaSSearchClient {
    private $apiKey;
    private $baseUrl;

    public function __construct($apiKey, $baseUrl = "https://api.example.com") {
        $this->apiKey = $apiKey;
        $this->baseUrl = $baseUrl;
    }

    public function search($query, $limit = 10) {
        $params = http_build_query([
            'q' => $query,
            'limit' => $limit,
        ]);

        $url = "{$this->baseUrl}/api/v1/search?{$params}";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer {$this->apiKey}",
            "Content-Type: application/json",
        ]);

        $response = curl_exec($ch);
        $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($statusCode !== 200) {
            throw new Exception("API error: {$statusCode}");
        }

        return json_decode($response, true);
    }

    public function getWallet() {
        $url = "{$this->baseUrl}/api/v1/wallet";

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer {$this->apiKey}",
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}

// Usage
$client = new SaaSSearchClient("sk_live_xxxxx");

try {
    $results = $client->search("machine learning");
    echo "Found " . $results['count'] . " results\n";
    echo "Cost: $" . $results['costDeducted'] . "\n";
    echo "Balance: $" . $results['remainingBalance'] . "\n";

    foreach ($results['results'] as $result) {
        echo "- " . $result['title'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

## Error Handling Patterns

### Exponential Backoff Retry

```javascript
async function searchWithRetry(query, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://api.example.com/api/v1/search?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer sk_live_xxxxx`,
          },
        }
      );

      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (response.status === 402) {
        throw new Error("Insufficient balance");
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
    }
  }
}
```

## Rate Limit Handling

```typescript
interface RateLimitError {
  status: 429;
  resetAt: Date;
  remaining: number;
}

async function searchWithQueueing(
  query: string,
  queue: PriorityQueue<SearchRequest>
) {
  const request = { query, priority: Date.now() };

  while (queue.length > 0) {
    try {
      const item = queue.dequeue();
      return await client.search(item.query);
    } catch (error) {
      if (error.status === 429) {
        const resetAt = new Date(error.resetAt);
        const delayMs = Math.max(0, resetAt.getTime() - Date.now());

        // Re-queue with new priority
        queue.enqueue(
          { ...item, priority: item.priority + delayMs },
          item.priority + delayMs
        );

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, delayMs + 1000)
        );
      } else {
        throw error;
      }
    }
  }
}
```
