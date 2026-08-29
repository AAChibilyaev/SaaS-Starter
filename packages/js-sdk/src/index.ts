export class AACSearchClient {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(config: {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
  }) {
    if (!config.apiKey) {
      throw new Error("API key is required");
    }

    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || "https://api.aacsearch.io/v1";
    this.timeout = config.timeout || 30000;
  }

  /**
   * Search for documents
   */
  async search(params: SearchParams): Promise<SearchResponse> {
    return this.request<SearchResponse>("POST", "/search", params);
  }

  /**
   * Get available collections
   */
  async getCollections(): Promise<string[]> {
    const response = await this.request<{ collections: string[] }>(
      "GET",
      "/collections"
    );
    return response.collections || [];
  }

  /**
   * Get collection details
   */
  async getCollection(name: string): Promise<Collection> {
    return this.request<Collection>("GET", `/collections/${name}`);
  }

  /**
   * Get a specific document
   */
  async getDocument(
    collection: string,
    documentId: string
  ): Promise<Record<string, any>> {
    return this.request(
      "GET",
      `/collections/${collection}/documents/${documentId}`
    );
  }

  /**
   * Get usage metrics
   */
  async getUsage(): Promise<UsageMetrics> {
    return this.request<UsageMetrics>("GET", "/usage");
  }

  /**
   * Get search history
   */
  async getSearchHistory(params?: Record<string, any>): Promise<SearchHistory[]> {
    const response = await this.request<{ searches: SearchHistory[] }>(
      "GET",
      "/search-history",
      params
    );
    return response.searches || [];
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await this.request<{ suggestions: string[] }>(
      "GET",
      "/suggestions",
      { q: query }
    );
    return response.suggestions || [];
  }

  /**
   * Make HTTP request
   */
  private async request<T = any>(
    method: string,
    endpoint: string,
    data?: Record<string, any>
  ): Promise<T> {
    const url = new URL(this.baseURL + endpoint);

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    if (method === "GET" && data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    } else if (data && method !== "GET") {
      options.body = JSON.stringify(data);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new AACSearchError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          error
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof AACSearchError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AACSearchError(
          `Request failed: ${error.message}`,
          500,
          error.message
        );
      }

      throw new AACSearchError("Unknown error occurred", 500, String(error));
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Custom error class for AACSearch API
 */
export class AACSearchError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: string
  ) {
    super(message);
    this.name = "AACSearchError";
  }

  isAuthenticationError(): boolean {
    return this.code === 401;
  }

  isRateLimitError(): boolean {
    return this.code === 429;
  }

  isNotFoundError(): boolean {
    return this.code === 404;
  }
}

/**
 * Type definitions
 */
export interface SearchParams {
  q: string;
  collection?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  facets?: string[];
  filter_by?: string;
  search_mode?: "prefix" | "infix" | "exact" | "semantic";
}

export interface SearchHit {
  id: string;
  document: Record<string, any>;
  highlight?: Record<string, string[]>;
  text_match?: number;
}

export interface SearchResponse {
  hits: SearchHit[];
  found: number;
  out_of: number;
  page: number;
  search_time_ms: number;
}

export interface Collection {
  name: string;
  num_documents: number;
  fields: Field[];
}

export interface Field {
  name: string;
  type: "string" | "int32" | "int64" | "float" | "bool" | "auto";
  facet?: boolean;
  sort?: boolean;
  optional?: boolean;
}

export interface UsageMetrics {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  daily_requests: number;
  requests_remaining: number;
}

export interface SearchHistory {
  query: string;
  collection: string;
  results_count: number;
  searched_at: string;
}

export default AACSearchClient;
