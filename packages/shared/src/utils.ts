import { ApiError, SearchRequest } from "./types";

export function buildQueryString(params: Record<string, any>): string {
  const entries = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    });

  return entries.join("&");
}

export function parseApiError(response: any): ApiError {
  if (typeof response === "string") {
    return {
      code: "PARSE_ERROR",
      message: response,
      status: 500,
    };
  }

  return {
    code: response.code || "UNKNOWN_ERROR",
    message: response.message || "An unknown error occurred",
    status: response.status || 500,
    details: response.details,
  };
}

export function formatSearchQuery(search: SearchRequest): SearchRequest {
  return {
    ...search,
    q: search.q.trim(),
    per_page: Math.min(search.per_page || 10, 100),
    page: Math.max(search.page || 1, 1),
  };
}

export function calculateCost(
  requests: number,
  tokens: number,
  planType: string
): number {
  // Base pricing model - customize as needed
  const baseCostPerRequest = 0.001;
  const costPerToken = 0.00001;

  let multiplier = 1;
  switch (planType) {
    case "starter":
      multiplier = 0.8;
      break;
    case "pro":
      multiplier = 0.5;
      break;
    case "enterprise":
      multiplier = 0.2;
      break;
  }

  return (requests * baseCostPerRequest + tokens * costPerToken) * multiplier;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export function retryAsync<T>(
  fn: () => Promise<T>,
  options: {
    retries?: number;
    delay?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const { retries = 3, delay = 1000, backoff = true } = options;

  return new Promise((resolve, reject) => {
    const attempt = (attemptNum: number): void => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (attemptNum >= retries) {
            reject(error);
            return;
          }

          const waitTime = backoff ? delay * Math.pow(2, attemptNum - 1) : delay;
          setTimeout(() => {
            attempt(attemptNum + 1);
          }, waitTime);
        });
    };

    attempt(1);
  });
}

export function isNetworkError(error: any): boolean {
  if (error instanceof TypeError) {
    return error.message.includes("fetch") || error.message.includes("network");
  }
  return false;
}

export function isRateLimitError(status: number): boolean {
  return status === 429;
}

export function isAuthenticationError(status: number): boolean {
  return status === 401;
}

export function isAuthorizationError(status: number): boolean {
  return status === 403;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function parseJWT(token: string): Record<string, any> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = Buffer.from(payload, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
