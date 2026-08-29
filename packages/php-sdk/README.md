# AACSearch PHP SDK

Complete PHP integration for AACSearch - Advanced Semantic Search API.

## Features

- **Full Type Safety**: PHP 8.0+ with strict typing
- **Laravel Integration**: Built-in service provider and config
- **Error Handling**: Custom exception classes with detailed error info
- **PSR-16 Cache Support**: Optional caching layer
- **Guzzle HTTP**: Reliable HTTP client with retry support
- **Comprehensive Documentation**: Full API reference with examples

## Installation

```bash
composer require aacsearch/php-sdk
```

## Quick Start

### Standalone Usage

```php
<?php

require 'vendor/autoload.php';

use AACSearch\Client;

$client = new Client([
    'apiKey' => 'sk_live_your-api-key',
]);

// Search
$results = $client->search([
    'q' => 'machine learning',
    'collection' => 'documents',
    'per_page' => 10,
]);

echo "Found " . $results['found'] . " results\n";

foreach ($results['hits'] as $hit) {
    echo $hit['document']['title'] . "\n";
}
```

### Laravel Integration

#### 1. Publish Configuration

```bash
php artisan vendor:publish --provider="AACSearch\Laravel\AACSearchServiceProvider"
```

#### 2. Set Environment Variables

```bash
# .env
AACSEARCH_API_KEY=sk_live_your-api-key
AACSEARCH_BASE_URL=https://api.aacsearch.io/v1
AACSEARCH_TIMEOUT=30
```

#### 3. Register Service Provider

Add to `config/app.php`:

```php
'providers' => [
    // ...
    AACSearch\Laravel\AACSearchServiceProvider::class,
],

'aliases' => [
    // ...
    'AACSearch' => AACSearch\Laravel\Facades\AACSearch::class,
],
```

#### 4. Use in Your Application

```php
<?php

namespace App\Http\Controllers;

use AACSearch\Client;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function search(Request $request, Client $client)
    {
        $results = $client->search([
            'q' => $request->query('q'),
            'collection' => 'documents',
            'per_page' => 20,
        ]);

        return response()->json($results);
    }
}
```

## API Reference

### Search

```php
$results = $client->search([
    'q' => 'search query',           // Required
    'collection' => 'documents',     // Optional
    'per_page' => 10,                // Optional, default: 10
    'page' => 1,                     // Optional, default: 1
    'sort_by' => 'relevance',        // Optional
    'search_mode' => 'semantic',     // Optional: prefix|infix|exact|semantic
]);

// Response
[
    'hits' => [
        [
            'id' => 'doc-1',
            'document' => ['title' => '...', 'content' => '...'],
            'text_match' => 95,
        ],
        // ...
    ],
    'found' => 1234,
    'search_time_ms' => 45,
]
```

### Get Collections

```php
$collections = $client->getCollections();

// Response
['documents', 'articles', 'products']
```

### Get Collection Details

```php
$collection = $client->getCollection('documents');

// Response
[
    'name' => 'documents',
    'num_documents' => 1234,
    'fields' => [
        ['name' => 'title', 'type' => 'string'],
        ['name' => 'content', 'type' => 'string'],
    ],
]
```

### Get Document

```php
$document = $client->getDocument('documents', 'doc-123');

// Response
[
    'id' => 'doc-123',
    'title' => '...',
    'content' => '...',
]
```

### Get Usage

```php
$usage = $client->getUsage();

// Response
[
    'total_requests' => 1000,
    'total_tokens' => 50000,
    'total_cost' => 12.50,
    'requests_remaining' => 9000,
]
```

### Get Search History

```php
$history = $client->getSearchHistory([
    'limit' => 10,
    'offset' => 0,
]);

// Response
[
    ['query' => 'machine learning', 'results_count' => 145, ...],
    // ...
]
```

### Get Search Suggestions

```php
$suggestions = $client->getSearchSuggestions('mach');

// Response
['machine learning', 'machinery', 'machine vision', ...]
```

## Error Handling

```php
<?php

use AACSearch\Client;
use AACSearch\AACSearchException;

$client = new Client(['apiKey' => 'sk_live_...']);

try {
    $results = $client->search(['q' => 'query']);
} catch (AACSearchException $e) {
    // Handle error
    if ($e->isAuthenticationError()) {
        echo "Invalid API key";
    } elseif ($e->isRateLimitError()) {
        echo "Rate limit exceeded";
    } elseif ($e->isNotFoundError()) {
        echo "Resource not found";
    } else {
        echo "Error: " . $e->getMessage();
    }
}
```

## Advanced Usage

### Caching Results

```php
// Enable caching in config
// config/aacsearch.php
'cache_enabled' => true,
'cache_ttl' => 3600,

// Then use normally - results are cached automatically
$results = $client->search(['q' => 'query']);
```

### Custom Configuration

```php
$client = new Client([
    'apiKey' => 'sk_live_...',
    'baseUrl' => 'https://custom.api.example.com/v1',
    'timeout' => 60, // seconds
]);
```

### Batch Requests

```php
$queries = [
    'machine learning',
    'artificial intelligence',
    'data science',
];

$results = [];
foreach ($queries as $query) {
    $results[$query] = $client->search(['q' => $query]);
}
```

## Best Practices

1. **Store API Key Securely**
   ```php
   // Use environment variables
   $apiKey = env('AACSEARCH_API_KEY');
   ```

2. **Handle Rate Limits**
   ```php
   try {
       $results = $client->search(['q' => 'query']);
   } catch (AACSearchException $e) {
       if ($e->isRateLimitError()) {
           sleep(60); // Wait before retry
       }
   }
   ```

3. **Implement Caching**
   ```php
   // Cache search results
   $cacheKey = 'search:' . md5($query);
   if (Cache::has($cacheKey)) {
       return Cache::get($cacheKey);
   }
   ```

4. **Log Errors**
   ```php
   catch (AACSearchException $e) {
       Log::error('AACSearch error', [
           'message' => $e->getMessage(),
           'code' => $e->getCode(),
       ]);
   }
   ```

## Testing

```bash
# Run tests
composer test

# Run linting
composer lint

# Fix code style
composer lint-fix
```

## Requirements

- PHP 8.0+
- Guzzle HTTP Client 7.0+
- Laravel 8.0+ (for Laravel integration)

## Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Core search functionality
- Laravel service provider
- Complete error handling

## Support

- **Documentation**: https://docs.aacsearch.io
- **GitHub Issues**: https://github.com/AAChibilyaev/aacsearch
- **Email**: support@aacsearch.io

## License

MIT License - See LICENSE file for details
