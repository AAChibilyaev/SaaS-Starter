# AACSearch PHP SDK

Advanced PHP SDK for AACSearch API v1. Built for production use with comprehensive error handling, caching, and async support.

## Features

- ✅ Full typed PHP 8.0+ support with strict types
- ✅ Built-in request caching with PSR-16
- ✅ Automatic retry with exponential backoff
- ✅ Async support via ReactPHP/Amp
- ✅ Request rate limiting and queuing
- ✅ Circuit breaker pattern
- ✅ Comprehensive logging via PSR-3
- ✅ Laravel integration included
- ✅ Zero dependencies on core classes

## Installation

```bash
composer require aacsearch/sdk
```

### Optional Dependencies

```bash
# For async support
composer require react/http-client

# For PSR caching
composer require psr/cache cache/simple-psr6-cache

# For logging
composer require psr/log monolog/monolog
```

## Quick Start

```php
<?php

use AACSearch\Client;

$client = new Client(
    apiKey: 'sk_live_xxxxx'
);

$results = $client->search('machine learning');

echo "Found {$results->count} results\n";
echo "Cost: \${$results->costDeducted}\n";
echo "Balance: \${$results->remainingBalance}\n";

foreach ($results->results as $result) {
    echo "- {$result->title}\n";
}
```

## Configuration

```php
use AACSearch\Client;
use AACSearch\Config;

$config = new Config(
    apiKey: 'sk_live_xxxxx',
    baseUrl: 'https://api.example.com', // optional
    timeout: 30,
    maxRetries: 3,
    enableCache: true,
    cacheTTL: 300,
);

$client = new Client($config);
```

## Advanced Configuration

```php
use AACSearch\Client;
use AACSearch\Config;
use AACSearch\CircuitBreaker;

$config = new Config(
    apiKey: 'sk_live_xxxxx',
    circuitBreaker: new CircuitBreaker(
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 60
    ),
    requestTimeout: 30,
    maxConcurrentRequests: 5,
);

$client = new Client($config);
```

## API Methods

### search()

```php
$results = $client->search(
    query: 'machine learning',
    limit: 10,
    offset: 0,
    skipCache: false
);

echo $results->query;
echo $results->count;
echo $results->costDeducted;
echo $results->remainingBalance;
echo $results->tokensUsed;

foreach ($results->results as $result) {
    echo $result->id;
    echo $result->title;
    echo $result->excerpt;
    echo $result->score;
}
```

### getWallet()

```php
$wallet = $client->getWallet();

echo "Balance: {$wallet->balance} {$wallet->currency}\n";
echo "Total Spent: {$wallet->totalSpent}\n";
echo "Total Earned: {$wallet->totalEarned}\n";
echo "Created: {$wallet->createdAt->format('Y-m-d H:i:s')}\n";
```

### getUsageStats()

```php
// Last 30 days (default)
$stats = $client->getUsageStats();

// Last 7 days
$stats = $client->getUsageStats(days: 7);

echo "Total Cost: {$stats->totalCost}\n";
echo "Total Tokens: {$stats->totalTokensUsed}\n";

foreach ($stats->operations as $op) {
    echo "{$op->type}: {$op->count} operations, \${$op->totalCost}\n";
}
```

### getRateLimit()

```php
$limits = $client->getRateLimit();

echo "Requests/min: {$limits->requestsPerMinute}\n";
echo "Requests/day: {$limits->requestsPerDay}\n";
echo "Monthly token limit: {$limits->monthlyTokenLimit}\n";
echo "Concurrent requests: {$limits->concurrentRequests}\n";
```

### checkRateLimit()

```php
$check = $client->checkRateLimit();

if ($check->allowed) {
    echo "OK to proceed\n";
} else {
    echo "Rate limited until: {$check->nextResetAt->format('Y-m-d H:i:s')}\n";
    echo "Requests remaining: {$check->remaining}\n";
}
```

## Error Handling

```php
use AACSearch\Client;
use AACSearch\Exception\AuthenticationException;
use AACSearch\Exception\InsufficientBalanceException;
use AACSearch\Exception\RateLimitException;
use AACSearch\Exception\ValidationException;
use AACSearch\Exception\AACSearchException;

$client = new Client(apiKey: 'sk_live_xxxxx');

try {
    $results = $client->search('');
} catch (ValidationException $e) {
    echo "Invalid input: {$e->getMessage()}\n";
} catch (AuthenticationException $e) {
    echo "Authentication failed: {$e->getMessage()}\n";
} catch (InsufficientBalanceException $e) {
    echo "Insufficient balance: {$e->getRequiredAmount()}\n";
} catch (RateLimitException $e) {
    echo "Rate limited, retry after: {$e->getRetryAfter()}s\n";
} catch (AACSearchException $e) {
    echo "API error: {$e->getMessage()}\n";
}
```

## Caching

```php
use AACSearch\Client;
use AACSearch\Cache\ArrayCache;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;

// Use file-based cache
$cache = new FilesystemAdapter();

$client = new Client(
    apiKey: 'sk_live_xxxxx',
    cache: $cache,
    cacheTTL: 600 // 10 minutes
);

// First call: hits API
$results1 = $client->search('test');

// Second call: from cache
$results2 = $client->search('test');

// Skip cache
$results3 = $client->search('test', skipCache: true);

// Clear cache
$client->clearCache();
```

## Async Support

```php
use Amp\Http\Client\HttpClientBuilder;
use AACSearch\AsyncClient;

// Using Amp for concurrent requests
$httpClient = HttpClientBuilder::buildDefault();

$client = new AsyncClient(
    apiKey: 'sk_live_xxxxx',
    httpClient: $httpClient
);

// Execute multiple searches concurrently
$responses = \Amp\Promise\all([
    $client->search('AI'),
    $client->search('machine learning'),
    $client->search('deep learning'),
]);

\Amp\Loop::run(function () use ($responses) {
    $results = yield $responses;
    foreach ($results as $result) {
        echo "Found {$result->count} results\n";
    }
});
```

## Request Queuing

```php
$client = new Client(apiKey: 'sk_live_xxxxx');

// Queue multiple requests
$queue = $client->queue();
$queue->add('AI');
$queue->add('machine learning');
$queue->add('deep learning');

// Execute queue with automatic rate limit handling
$results = $queue->execute();

foreach ($results as $result) {
    echo "Found {$result->count} results\n";
}
```

## Logging

```php
use AACSearch\Client;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;

$logger = new Logger('aacsearch');
$logger->pushHandler(new StreamHandler('php://stdout'));

$client = new Client(
    apiKey: 'sk_live_xxxxx',
    logger: $logger
);

// All API calls will be logged
$results = $client->search('test');
```

## Laravel Integration

### Configuration

```php
// config/aacsearch.php
return [
    'api_key' => env('AACSEARCH_API_KEY'),
    'base_url' => env('AACSEARCH_BASE_URL', 'https://api.example.com'),
    'timeout' => env('AACSEARCH_TIMEOUT', 30),
    'cache' => true,
    'cache_ttl' => 300,
];
```

### Service Provider

```php
// app/Providers/AACSearchServiceProvider.php
use Illuminate\Support\ServiceProvider;
use AACSearch\Client;

class AACSearchServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(Client::class, function () {
            return new Client(config('aacsearch.api_key'));
        });
    }
}
```

### Usage in Controllers

```php
// app/Http/Controllers/SearchController.php
use AACSearch\Client;

class SearchController
{
    public function search(Client $client)
    {
        $results = $client->search(request('q'));
        
        return response()->json([
            'results' => $results->results,
            'cost' => $results->costDeducted,
            'balance' => $results->remainingBalance,
        ]);
    }

    public function wallet(Client $client)
    {
        $wallet = $client->getWallet();
        
        return response()->json($wallet);
    }
}
```

## Type Declarations

```php
<?php
declare(strict_types=1);

use AACSearch\Client;
use AACSearch\DTO\SearchResponse;
use AACSearch\DTO\WalletInfo;

class SearchService
{
    private Client $client;

    public function __construct(Client $client)
    {
        $this->client = $client;
    }

    public function performSearch(string $query): SearchResponse
    {
        return $this->client->search($query);
    }

    public function checkBalance(): WalletInfo
    {
        return $this->client->getWallet();
    }
}
```

## Performance Tips

1. **Enable caching** for frequently searched queries
2. **Use async client** for concurrent requests
3. **Implement request queuing** to respect rate limits
4. **Pre-flight balance check** before expensive operations
5. **Use proper logging** for debugging
6. **Implement circuit breaker** for fault tolerance

## Testing

```php
use PHPUnit\Framework\TestCase;
use AACSearch\Client;
use AACSearch\Mock\MockTransport;

class SearchTest extends TestCase
{
    public function testSearch()
    {
        $transport = new MockTransport([
            'search' => ['count' => 42, 'results' => []],
        ]);

        $client = new Client(
            apiKey: 'sk_test_xxxxx',
            transport: $transport
        );

        $results = $client->search('test');

        $this->assertEquals(42, $results->count);
    }
}
```

## Support

- Documentation: https://aacsearch.com/docs/php
- GitHub: https://github.com/aac/sdk-php
- Email: support@aacsearch.com
