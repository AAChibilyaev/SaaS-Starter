export interface SearchResult<T = unknown> {
  id: string;
  title: string;
  description?: string;
  type: string;
  score: number;
  data?: T;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

export interface IndexableDocument {
  id: string;
  type: string;
  title: string;
  description?: string;
  content?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface SearchProvider {
  /**
   * Search for documents matching the query
   */
  search<T = unknown>(options: SearchOptions): Promise<SearchResult<T>[]>;

  /**
   * Index a document or batch of documents
   */
  indexDocument(document: IndexableDocument): Promise<void>;
  indexDocuments(documents: IndexableDocument[]): Promise<void>;

  /**
   * Remove a document from the index
   */
  removeDocument(id: string): Promise<void>;

  /**
   * Clear all documents of a specific type
   */
  clearType(type: string): Promise<void>;

  /**
   * Get search statistics
   */
  getStats(): Promise<{
    totalDocuments: number;
    indexedTypes: string[];
  }>;
}
