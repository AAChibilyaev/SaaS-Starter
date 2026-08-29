# Quickstart Guide

Get started with the SaaS Search API in 5 minutes.

## Prerequisites

- An API key (get one at https://dashboard.example.com/api-keys)
- Your preferred programming language/environment
- Basic understanding of REST APIs

## Step 1: Get Your API Key

1. Log in to your dashboard at https://dashboard.example.com
2. Navigate to **Settings** → **API Keys**
3. Click **Create New Key**
4. Name your key (e.g., "Development", "Production")
5. Copy your key and store it safely: `sk_live_xxxxx`

## Step 2: Make Your First Search

### Using cURL

```bash
curl -X GET "https://api.example.com/api/v1/search?q=machine%20learning" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

### Using JavaScript

```javascript
const apiKey = "sk_live_xxxxx";

fetch("https://api.example.com/api/v1/search?q=machine%20learning", {
  headers: {
    Authorization: `Bearer ${apiKey}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    console.log(`Found ${data.count} results`);
    console.log(`Cost: $${data.costDeducted}`);
    data.results.forEach((result) => {
      console.log(`- ${result.title}`);
    });
  });
```

### Using Python

```python
import requests

response = requests.get(
    "https://api.example.com/api/v1/search",
    params={"q": "machine learning"},
    headers={"Authorization": "Bearer sk_live_xxxxx"},
)

data = response.json()
print(f"Found {data['count']} results")
print(f"Cost: ${data['costDeducted']}")

for result in data["results"]:
    print(f"- {result['title']}")
```

### Response

```json
{
  "success": true,
  "query": "machine learning",
  "count": 42,
  "results": [
    {
      "id": "doc-001",
      "title": "Introduction to Machine Learning",
      "excerpt": "Machine learning is a subset of...",
      "score": 0.95
    }
  ],
  "costDeducted": 0.0142,
  "remainingBalance": 99.9858,
  "tokensUsed": 420
}
```

✅ **Success!** You've made your first API call.

## Step 3: Check Your Wallet Balance

```bash
curl -X GET "https://api.example.com/api/v1/wallet" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

Response:
```json
{
  "id": "wallet-123",
  "balance": 99.9858,
  "currency": "usd",
  "totalSpent": 0.0142,
  "totalEarned": 100.0
}
```

## Step 4: Monitor Your Usage

```bash
curl -X GET "https://api.example.com/api/v1/usage?days=7" \
  -H "Authorization: Bearer sk_live_xxxxx"
```

Response:
```json
{
  "period": {
    "start": "2024-01-14T00:00:00Z",
    "end": "2024-01-21T00:00:00Z"
  },
  "totalCost": 0.0142,
  "totalTokensUsed": 420,
  "operations": [
    {
      "type": "search",
      "count": 1,
      "totalCost": 0.0142,
      "totalTokens": 420
    }
  ]
}
```

## Step 5: Install SDK (Optional)

For easier integration, install the SDK:

```bash
npm install @saas-search/sdk
```

Then use it in your code:

```typescript
import { SaaSSearchClient } from "@saas-search/sdk";

const client = new SaaSSearchClient({
  apiKey: "sk_live_xxxxx",
});

const results = await client.search({
  query: "machine learning",
  limit: 10,
});

console.log(`Cost: $${results.costDeducted}`);
console.log(`Balance: $${results.remainingBalance}`);
```

## Common Tasks

### Search with Pagination

```bash
# First 10 results
curl "https://api.example.com/api/v1/search?q=test&limit=10&offset=0"

# Next 10 results
curl "https://api.example.com/api/v1/search?q=test&limit=10&offset=10"
```

### Check Before Search

```javascript
const balance = await client.getWallet();

if (balance.balance > 0.02) {
  const results = await client.search({ query: "test" });
} else {
  console.log("Insufficient balance");
}
```

### Handle Rate Limits

```javascript
async function searchWithRetry(query) {
  try {
    return await client.search({ query });
  } catch (error) {
    if (error.status === 429) {
      console.log("Rate limited, waiting...");
      await new Promise((resolve) =>
        setTimeout(resolve, 2000)
      );
      return searchWithRetry(query);
    }
    throw error;
  }
}
```

## Cost Examples

| Query | Results | Tokens | Base Cost | Token Cost | Total |
|-------|---------|--------|-----------|------------|-------|
| "test" (4 chars) | 10 | 105 | $0.01 | $0.0105 | $0.0205 |
| "machine learning" (17 chars) | 42 | 425 | $0.01 | $0.0425 | $0.0525 |
| "artificial intelligence" (24 chars) | 100 | 1006 | $0.01 | $0.1006 | $0.1106 |

## Authentication

Always include your API key in the `Authorization` header:

```
Authorization: Bearer sk_live_xxxxx
```

**Never** share your API key or commit it to version control.

### Using Environment Variables

```javascript
const apiKey = process.env.SAAS_SEARCH_API_KEY;
// Ensure your .env file contains: SAAS_SEARCH_API_KEY=sk_live_xxxxx
```

```bash
export SAAS_SEARCH_API_KEY="sk_live_xxxxx"
curl -H "Authorization: Bearer $SAAS_SEARCH_API_KEY" \
  https://api.example.com/api/v1/search?q=test
```

## Troubleshooting

### 401 Unauthorized

**Problem:** Getting a 401 error

**Solution:** Check that your API key is correct and included in the header:
```bash
Authorization: Bearer sk_live_xxxxx
```

### 402 Payment Required

**Problem:** Getting a 402 error

**Solution:** You've run out of credits. Add funds to your wallet:
1. Go to https://dashboard.example.com/billing
2. Click **Add Funds**
3. Choose amount and payment method
4. Complete checkout

### 429 Rate Limited

**Problem:** Getting a 429 error

**Solution:** You've exceeded your rate limits. Options:
1. Wait for the rate limit to reset
2. Implement exponential backoff retry logic
3. Upgrade your plan for higher limits

### Connection Errors

**Problem:** Network or DNS errors

**Solution:** Verify:
1. Your internet connection is working
2. The API URL is correct: `https://api.example.com`
3. Firewall isn't blocking the connection
4. Try with `curl` to test basic connectivity:
   ```bash
   curl -v https://api.example.com/api/v1/wallet \
     -H "Authorization: Bearer sk_live_xxxxx"
   ```

## Next Steps

1. **Read the API Reference:** Learn all endpoints at `/api-docs`
2. **Explore SDK Documentation:** Check SDK_GUIDE.md for advanced usage
3. **View Integration Examples:** See INTEGRATION_EXAMPLES.md for your language
4. **Set Up Dashboard:** Create API keys and monitor usage in your dashboard
5. **Contact Support:** Email support@example.com for questions

## Resources

- **Dashboard:** https://dashboard.example.com
- **API Docs:** https://api.example.com/api-docs
- **Status Page:** https://status.example.com
- **Email Support:** support@example.com
- **GitHub:** https://github.com/example/saas-search

## Tips

- 💡 Use the pre-flight `/api/v1/rate-limit` check to avoid failed requests
- 💡 Cache search results locally when possible to save costs
- 💡 Monitor usage regularly with `/api/v1/usage`
- 💡 Use the SDK for better error handling and type safety
- 💡 Set up alerts for low wallet balance

Happy searching! 🚀
