/**
 * SaaS Search SDK - Official client for integrating Typesense search with managed billing
 * @packageDocumentation
 */

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResult<T = unknown> {
  id: string;
  title: string;
  description?: string;
  type: string;
  score: number;
  data?: T;
}

export interface ClientConfig {
  apiKey: string;
  apiUrl?: string;
  webhookUrl?: string;
}

export interface SearchResponse<T = unknown> {
  success: boolean;
  query: string;
  count: number;
  results: SearchResult<T>[];
  costDeducted: number;
  remainingBalance: number;
  error?: string;
}

export interface WalletInfo {
  balance: number;
  totalSpent: number;
  totalEarned: number;
  currency: string;
}

export interface UsageStats {
  [operationType: string]: {
    count: number;
    totalCost: number;
    totalTokens: number;
  };
}

/**
 * Main client for SaaS Search integration
 */
export class SaaSSearchClient {
  private apiKey: string;
  private apiUrl: string;
  private webhookUrl?: string;

  constructor(config: ClientConfig) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl || "https://api.saas-search.dev";
    this.webhookUrl = config.webhookUrl;
  }

  /**
   * Perform a search query
   */
  async search<T = unknown>(options: SearchOptions): Promise<SearchResponse<T>> {
    try {
      const params = new URLSearchParams({
        q: options.query,
        limit: (options.limit || 10).toString(),
        offset: (options.offset || 0).toString(),
      });

      const response = await fetch(
        `${this.apiUrl}/api/v1/search?${params}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        return {
          success: false,
          query: options.query,
          count: 0,
          results: [],
          costDeducted: 0,
          remainingBalance: 0,
          error: error.message || "Search failed",
        };
      }

      const data = await response.json();
      return {
        success: true,
        query: options.query,
        ...data,
      };
    } catch (error) {
      return {
        success: false,
        query: options.query,
        count: 0,
        results: [],
        costDeducted: 0,
        remainingBalance: 0,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  /**
   * Get wallet information
   */
  async getWallet(): Promise<WalletInfo> {
    const response = await fetch(`${this.apiUrl}/api/v1/wallet`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch wallet");
    }

    return response.json();
  }

  /**
   * Get usage statistics
   */
  async getUsageStats(days?: number): Promise<UsageStats> {
    const params = new URLSearchParams();
    if (days) params.append("days", days.toString());

    const response = await fetch(
      `${this.apiUrl}/api/v1/usage?${params}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch usage stats");
    }

    return response.json();
  }

  /**
   * Get rate limit configuration
   */
  async getRateLimit(): Promise<Record<string, number>> {
    const response = await fetch(`${this.apiUrl}/api/v1/rate-limit`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch rate limit");
    }

    return response.json();
  }

  /**
   * Check if operation is allowed based on rate limits
   */
  async checkLimit(): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/v1/check-limit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Export for Node.js and browser environments
 */
export default SaaSSearchClient;
