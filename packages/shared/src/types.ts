/**
 * AACSearch Shared Types
 * Used across all SDKs (React, PHP, JavaScript, etc.)
 */

export interface SearchRequest {
  q: string;
  collection?: string;
  per_page?: number;
  page?: number;
  sort_by?: string;
  facets?: string[];
  filter_by?: string;
  search_mode?: SearchMode;
}

export type SearchMode = "prefix" | "infix" | "exact" | "semantic";

export interface SearchResponse {
  hits: SearchHit[];
  found: number;
  out_of: number;
  page: number;
  search_time_ms: number;
  facet_counts?: FacetCount[];
}

export interface SearchHit {
  id: string;
  document: Record<string, unknown>;
  highlight?: Record<string, string[]>;
  text_match?: number;
}

export interface FacetCount {
  counts: Array<{
    count: number;
    highlighted?: string;
    value: string;
  }>;
  field_name: string;
  stats?: {
    avg?: number;
    max?: number;
    min?: number;
    sum?: number;
  };
}

export interface UsageMetrics {
  total_requests: number;
  total_tokens: number;
  total_cost: number;
  daily_requests: number;
  requests_remaining: number;
  usage_period_end: string;
  plan: PlanType;
}

export type PlanType = "free" | "starter" | "pro" | "enterprise";

export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface Collection {
  name: string;
  num_documents: number;
  created_at: string;
  fields: Field[];
}

export interface Field {
  name: string;
  type: FieldType;
  facet?: boolean;
  sort?: boolean;
  optional?: boolean;
}

export type FieldType = "string" | "int32" | "int64" | "float" | "bool" | "auto";

export interface Document {
  id: string;
  [key: string]: unknown;
}

export interface SearchHistory {
  query: string;
  collection: string;
  results_count: number;
  searched_at: string;
  search_mode: SearchMode;
}

export interface WebhookPayload {
  event: WebhookEvent;
  data: Record<string, unknown>;
  timestamp: string;
  request_id: string;
}

export type WebhookEvent =
  | "search.completed"
  | "search.failed"
  | "document.indexed"
  | "document.deleted"
  | "usage.updated"
  | "rate_limit.exceeded";

export interface ClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
  offset?: number;
  limit?: number;
}

export interface SortParam {
  field: string;
  order: "asc" | "desc";
}

export interface FilterParam {
  field: string;
  operator: "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "in" | "nin";
  value: unknown;
}
