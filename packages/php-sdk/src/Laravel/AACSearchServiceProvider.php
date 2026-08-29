<?php

namespace AACSearch\Laravel;

use AACSearch\Client;
use Illuminate\Support\ServiceProvider;

class AACSearchServiceProvider extends ServiceProvider
{
    /**
     * Register AACSearch service in container
     */
    public function register(): void
    {
        $this->app->singleton('aacsearch', function ($app) {
            return new Client([
                'apiKey' => config('aacsearch.api_key'),
                'baseUrl' => config('aacsearch.base_url', 'https://api.aacsearch.io/v1'),
                'timeout' => config('aacsearch.timeout', 30),
            ]);
        });
    }

    /**
     * Bootstrap AACSearch service
     */
    public function boot(): void
    {
        $this->publishes([
            __DIR__ . '/config/aacsearch.php' => config_path('aacsearch.php'),
        ], 'config');
    }
}
