<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AACSearch API Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may specify your AACSearch API key and other configuration
    | options for the AACSearch service.
    |
    */

    'api_key' => env('AACSEARCH_API_KEY', ''),

    'base_url' => env('AACSEARCH_BASE_URL', 'https://api.aacsearch.io/v1'),

    'timeout' => env('AACSEARCH_TIMEOUT', 30),

    /*
    |--------------------------------------------------------------------------
    | Cache Configuration
    |--------------------------------------------------------------------------
    |
    | Enable caching for search results and API responses
    |
    */

    'cache_enabled' => env('AACSEARCH_CACHE_ENABLED', false),

    'cache_ttl' => env('AACSEARCH_CACHE_TTL', 3600),

    'cache_store' => env('AACSEARCH_CACHE_STORE', 'default'),
];
