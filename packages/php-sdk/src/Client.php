<?php

namespace AACSearch;

use GuzzleHttp\Client as GuzzleClient;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;

class Client
{
    private string $apiKey;
    private string $baseUrl;
    private int $timeout;
    private GuzzleClient $httpClient;

    public function __construct(array $config = [])
    {
        $this->apiKey = $config['apiKey'] ?? '';
        $this->baseUrl = $config['baseUrl'] ?? 'https://api.aacsearch.io/v1';
        $this->timeout = $config['timeout'] ?? 30;

        if (empty($this->apiKey)) {
            throw new \InvalidArgumentException('API key is required');
        }

        $this->httpClient = new GuzzleClient([
            'base_uri' => $this->baseUrl,
            'timeout' => $this->timeout,
            'headers' => [
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
                'User-Agent' => 'AACSearch-PHP-SDK/1.0.0',
            ],
        ]);
    }

    /**
     * Search for documents
     */
    public function search(array $params = []): array
    {
        return $this->request('POST', '/search', $params);
    }

    /**
     * Get available collections
     */
    public function getCollections(): array
    {
        $response = $this->request('GET', '/collections');
        return $response['collections'] ?? [];
    }

    /**
     * Get collection details
     */
    public function getCollection(string $name): array
    {
        return $this->request('GET', "/collections/{$name}");
    }

    /**
     * Get a specific document
     */
    public function getDocument(string $collection, string $documentId): array
    {
        return $this->request('GET', "/collections/{$collection}/documents/{$documentId}");
    }

    /**
     * Get usage metrics
     */
    public function getUsage(): array
    {
        return $this->request('GET', '/usage');
    }

    /**
     * Get search history
     */
    public function getSearchHistory(array $params = []): array
    {
        $response = $this->request('GET', '/search-history', $params);
        return $response['searches'] ?? [];
    }

    /**
     * Get search suggestions
     */
    public function getSearchSuggestions(string $query): array
    {
        $response = $this->request('GET', '/suggestions', ['q' => $query]);
        return $response['suggestions'] ?? [];
    }

    /**
     * Make HTTP request
     */
    private function request(string $method, string $endpoint, array $data = []): array
    {
        try {
            $options = [];

            if ($method === 'GET' && !empty($data)) {
                $options['query'] = $data;
            } elseif ($method !== 'GET' && !empty($data)) {
                $options['json'] = $data;
            }

            $response = $this->httpClient->request($method, $endpoint, $options);
            $body = (string) $response->getBody();

            return json_decode($body, true) ?? [];
        } catch (RequestException $e) {
            throw new AACSearchException(
                'API request failed: ' . $e->getMessage(),
                $e->getCode(),
                $e
            );
        } catch (GuzzleException $e) {
            throw new AACSearchException(
                'HTTP client error: ' . $e->getMessage(),
                $e->getCode(),
                $e
            );
        }
    }
}
