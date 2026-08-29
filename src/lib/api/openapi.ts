export const openapi = {
  openapi: "3.1.0",
  info: {
    title: "AACSearch API v1",
    description: "Advanced search platform with integrated billing, rate limiting, usage tracking, and AI-powered results",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
    },
  },
  servers: [
    {
      url: "https://api.example.com",
      description: "Production server",
    },
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "token",
        description: "API key in format: Authorization: Bearer sk_live_...",
      },
    },
    schemas: {
      SearchRequest: {
        type: "object",
        required: ["q"],
        properties: {
          q: {
            type: "string",
            description: "Search query",
            example: "machine learning",
          },
          limit: {
            type: "integer",
            description: "Maximum number of results (default: 10)",
            example: 10,
            minimum: 1,
            maximum: 100,
          },
          offset: {
            type: "integer",
            description: "Pagination offset (default: 0)",
            example: 0,
            minimum: 0,
          },
        },
      },
      SearchResult: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
          query: {
            type: "string",
            example: "machine learning",
          },
          count: {
            type: "integer",
            example: 42,
          },
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                },
                title: {
                  type: "string",
                },
                excerpt: {
                  type: "string",
                },
                score: {
                  type: "number",
                },
              },
            },
          },
          costDeducted: {
            type: "number",
            format: "double",
            example: 0.0142,
            description: "Total cost deducted from wallet ($0.01 base + token costs)",
          },
          remainingBalance: {
            type: "number",
            format: "double",
            example: 99.9858,
            description: "Balance remaining in wallet after deduction",
          },
          tokensUsed: {
            type: "integer",
            example: 420,
            description: "Number of tokens used in search and processing",
          },
        },
      },
      WalletInfo: {
        type: "object",
        properties: {
          id: {
            type: "string",
            format: "uuid",
          },
          userId: {
            type: "string",
          },
          balance: {
            type: "number",
            format: "double",
            example: 100.0,
            description: "Current wallet balance in USD",
          },
          currency: {
            type: "string",
            example: "usd",
          },
          totalSpent: {
            type: "number",
            format: "double",
            example: 50.25,
            description: "Total amount spent on API usage",
          },
          totalEarned: {
            type: "number",
            format: "double",
            example: 150.25,
            description: "Total credits earned or purchased",
          },
          createdAt: {
            type: "string",
            format: "date-time",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      UsageStats: {
        type: "object",
        properties: {
          period: {
            type: "object",
            properties: {
              start: {
                type: "string",
                format: "date-time",
              },
              end: {
                type: "string",
                format: "date-time",
              },
            },
          },
          totalCost: {
            type: "number",
            format: "double",
            example: 25.50,
          },
          totalTokensUsed: {
            type: "integer",
            example: 50000,
          },
          operations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  example: "search",
                },
                count: {
                  type: "integer",
                  example: 100,
                },
                totalCost: {
                  type: "number",
                  format: "double",
                },
                totalTokens: {
                  type: "integer",
                },
              },
            },
          },
        },
      },
      RateLimitInfo: {
        type: "object",
        properties: {
          requestsPerMinute: {
            type: "integer",
            example: 100,
          },
          requestsPerDay: {
            type: "integer",
            example: 10000,
          },
          monthlyTokenLimit: {
            type: "integer",
            example: 1000000,
          },
          concurrentRequests: {
            type: "integer",
            example: 10,
          },
        },
      },
      RateLimitCheck: {
        type: "object",
        properties: {
          allowed: {
            type: "boolean",
            example: true,
          },
          nextResetAt: {
            type: "string",
            format: "date-time",
            description: "When the rate limit will reset",
          },
          remaining: {
            type: "integer",
            example: 99,
            description: "Requests remaining in current window",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Invalid API key",
          },
        },
      },
      ValidationError: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Validation failed",
          },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                },
                message: {
                  type: "string",
                },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    "/api/v1/search": {
      get: {
        summary: "Search with billing",
        description:
          "Performs a search query, deducts costs from wallet, and returns results with usage information. Requires valid API key and sufficient wallet balance.",
        operationId: "searchGet",
        parameters: [
          {
            name: "q",
            in: "query",
            description: "Search query",
            required: true,
            schema: {
              type: "string",
            },
            example: "machine learning",
          },
          {
            name: "limit",
            in: "query",
            description: "Maximum number of results (1-100, default: 10)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
            },
          },
          {
            name: "offset",
            in: "query",
            description: "Pagination offset (default: 0)",
            schema: {
              type: "integer",
              minimum: 0,
              default: 0,
            },
          },
        ],
        tags: ["Search"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Search completed successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/SearchResult",
                },
              },
            },
          },
          "400": {
            description: "Missing required search query",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "402": {
            description: "Insufficient wallet balance for this search",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "429": {
            description: "Rate limit exceeded",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error during search",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/wallet": {
      get: {
        summary: "Get wallet information",
        description:
          "Retrieve current wallet balance, total spent, and total earned for the authenticated user.",
        operationId: "getWallet",
        tags: ["Wallet"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Wallet information retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/WalletInfo",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error retrieving wallet",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/usage": {
      get: {
        summary: "Get usage statistics",
        description:
          "Retrieve usage statistics for the authenticated user over a specified number of days (default: 30).",
        operationId: "getUsageStats",
        parameters: [
          {
            name: "days",
            in: "query",
            description: "Number of days to retrieve stats for (default: 30)",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 365,
              default: 30,
            },
          },
        ],
        tags: ["Usage"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Usage statistics retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsageStats",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error retrieving usage stats",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/rate-limit": {
      get: {
        summary: "Get rate limit information",
        description: "Retrieve current rate limit configuration for the authenticated user.",
        operationId: "getRateLimit",
        tags: ["Rate Limiting"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Rate limit information retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RateLimitInfo",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error retrieving rate limit",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Check rate limit status",
        description:
          "Check if the user can make another request based on current rate limits. Useful for pre-flight checks before making API calls.",
        operationId: "checkRateLimit",
        tags: ["Rate Limiting"],
        security: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Rate limit check completed",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/RateLimitCheck",
                },
              },
            },
          },
          "401": {
            description: "Missing or invalid API key",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
          "500": {
            description: "Server error checking rate limit",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Error",
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Search",
      description: "Search operations with integrated billing",
    },
    {
      name: "Wallet",
      description: "Wallet and credit balance management",
    },
    {
      name: "Usage",
      description: "Usage tracking and statistics",
    },
    {
      name: "Rate Limiting",
      description: "Rate limit configuration and checking",
    },
  ],
} as const;
