// Main client
export { AACSearchClient } from "./AACSearchClient";
export type {
  AACSearchConfig,
  SearchParams,
  SearchResult,
  Document,
  UsageSummary,
  ApiResponse,
} from "./AACSearchClient";

// Hooks
export {
  useAACSearch,
  useAACDocument,
  useAACUsage,
  useAACSearchSuggestions,
} from "./hooks";
export type {
  UseAACSearchOptions,
  UseAACSearchResult,
  UseAACDocumentResult,
  UseAACUsageResult,
  UseAACSearchSuggestionsResult,
} from "./hooks";
