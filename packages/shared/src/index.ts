// Types
export type {
  SearchRequest,
  SearchResponse,
  SearchHit,
  FacetCount,
  UsageMetrics,
  ApiError,
  ApiResponse,
  Collection,
  Field,
  Document,
  SearchHistory,
  WebhookPayload,
  ClientConfig,
  RequestOptions,
  PaginationParams,
  SortParam,
  FilterParam,
} from "./types";

export type { SearchMode, PlanType, FieldType, WebhookEvent } from "./types";

// Utilities
export {
  buildQueryString,
  parseApiError,
  formatSearchQuery,
  calculateCost,
  debounce,
  throttle,
  retryAsync,
  isNetworkError,
  isRateLimitError,
  isAuthenticationError,
  isAuthorizationError,
  formatNumber,
  formatCurrency,
  formatDate,
  generateRequestId,
  parseJWT,
} from "./utils";
