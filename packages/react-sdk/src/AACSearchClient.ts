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

export interface SearchResult {
  hits: Document[];
  found: number;
  out_of: number;
  page: number;
  search_time_ms: number;
}

export interface Document {
  id: string;
  [key: string]: any;
}

export interface UsageSummary {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  daily_requests: number;
  requests_remaining: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AACSearchConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  debounce?: number;
}

export class AACSearchClient {
  private apiKey: string;
  private baseURL: string;
  private timeout: number;

  constructor(config: AACSearchConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || "https://api.aacsearch.io/v1";
    this.timeout = config.timeout || 30000;
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const response = await this.request<SearchResult>("POST", "/search", {
      ...params,
    });
    return response;
  }

  async getCollections(): Promise<string[]> {
    const response = await this.request<{ collections: string[] }>(
      "GET",
      "/collections"
    );
    return response.collections;
  }

  async getCollection(name: string): Promise<any> {
    const response = await this.request("GET", `/collections/${name}`);
    return response;
  }

  async getDocument(collectionName: string, documentId: string): Promise<any> {
    const response = await this.request(
      "GET",
      `/collections/${collectionName}/documents/${documentId}`
    );
    return response;
  }

  async getUsage(): Promise<UsageSummary> {
    const response = await this.request<UsageSummary>("GET", "/usage");
    return response;
  }

  async getSearchHistory(): Promise<any[]> {
    const response = await this.request<{ searches: any[] }>(
      "GET",
      "/search-history"
    );
    return response.searches;
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await this.request<{ suggestions: string[] }>(
      "GET",
      "/suggestions",
      { q: query }
    );
    return response.suggestions;
  }

  private async request<T = any>(
    method: string,
    endpoint: string,
    body?: any,
    query?: Record<string, string>
  ): Promise<T> {
    const url = new URL(this.baseURL + endpoint);

    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url.toString(), {
        ...options,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export default AACSearchClient;
