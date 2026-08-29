# API Reference

Complete reference documentation for the AACSearch API v1.

## Authentication

All API endpoints require authentication using an API key. Include your API key in the `Authorization` header:

```
Authorization: Bearer sk_live_...
```

### Getting an API Key

API keys are generated from your dashboard at `https://dashboard.example.com/api-keys`.

### API Key Format

- **Prefix:** `sk_live_` (production) or `sk_test_` (testing)
- **Length:** 48 characters total
- **Security:** Keep API keys secure and never commit to version control

### Key Expiration

API keys can be configured to expire after a set period. You'll receive a 401 response if your key has expired.

### Rate Limiting

Each API key has rate limits based on your plan tier. When rate limited, the API returns a `429` status code with headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1234567890
```

## Endpoints

### Search

**Endpoint:** `GET /api/v1/search`

Perform a search query with integrated billing.

**Parameters:**
- `q` (string, required): Search query
- `limit` (integer, optional): Max results (1-100, default: 10)
- `offset` (integer, optional): Pagination offset (default: 0)

**Cost:** $0.01 base + $0.0001 per token

**Response:** SearchResult object with results, costDeducted, remainingBalance

### Get Wallet

**Endpoint:** `GET /api/v1/wallet`

Retrieve wallet information for authenticated user.

**Response:** WalletInfo with balance, totalSpent, totalEarned, currency

### Get Usage

**Endpoint:** `GET /api/v1/usage`

Retrieve usage statistics with optional date range.

**Parameters:**
- `days` (integer, optional): Days to retrieve (1-365, default: 30)

**Response:** UsageStats with totalCost, totalTokensUsed, operations breakdown

### Rate Limits

**GET /api/v1/rate-limit** - Retrieve rate limit configuration
**POST /api/v1/rate-limit** - Check if request is allowed

## Error Handling

### 401 Unauthorized
Invalid or missing API key. Verify your key and try again.

### 402 Payment Required
Insufficient wallet balance. Add funds to continue.

### 429 Too Many Requests
Rate limit exceeded. Implement exponential backoff and retry.

### 500 Server Error
Internal server error. Check status page and retry later.

## Billing

### Cost Calculation
```
tokens = ceil(query_length / 4) + (result_count * 10)
total_cost = 0.01 + (tokens * 0.0001)
```

### Example Pricing
- Small query (10 chars, 5 results): $0.0155
- Medium query (20 chars, 20 results): $0.0320
- Large query (50 chars, 100 results): $0.1210

## Support

For issues: support@aacsearch.com
