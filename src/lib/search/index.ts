export type { SearchProvider, SearchResult, SearchOptions, IndexableDocument } from "./provider";

// Export the configured search provider
// Customers only interact with this, never directly with Typesense
export { typesenseProvider as searchProvider } from "./typesense";
