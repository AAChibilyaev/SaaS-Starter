import { useEffect, useState, useCallback, useRef } from "react";
import {
  AACSearchClient,
  SearchParams,
  SearchResult,
  Document,
  UsageSummary,
} from "./AACSearchClient";

export interface UseAACSearchOptions extends Omit<SearchParams, "q"> {
  enabled?: boolean;
  debounceMs?: number;
}

export interface UseAACSearchResult {
  data: SearchResult | null;
  loading: boolean;
  error: string | null;
}

export function useAACSearch(
  client: AACSearchClient,
  query: string,
  options: UseAACSearchOptions = {}
): UseAACSearchResult {
  const [data, setData] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const { enabled = true, debounceMs = 300, ...searchParams } = options;

  useEffect(() => {
    if (!enabled || !query.trim()) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    const performSearch = async () => {
      try {
        const result = await client.search({
          q: query,
          ...searchParams,
        });
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An error occurred during search"
        );
      } finally {
        setLoading(false);
      }
    };

    debounceTimeoutRef.current = setTimeout(performSearch, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [client, query, enabled, debounceMs, searchParams]);

  return { data, loading, error };
}

export interface UseAACDocumentResult {
  data: Document | null;
  loading: boolean;
  error: string | null;
}

export function useAACDocument(
  client: AACSearchClient,
  collectionName: string,
  documentId: string,
  enabled = true
): UseAACDocumentResult {
  const [data, setData] = useState<Document | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !documentId) return;

    const fetchDocument = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await client.getDocument(collectionName, documentId);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch document"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [client, collectionName, documentId, enabled]);

  return { data, loading, error };
}

export interface UseAACUsageResult {
  data: UsageSummary | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useAACUsage(client: AACSearchClient): UseAACUsageResult {
  const [data, setData] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await client.getUsage();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch usage");
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, error, refresh };
}

export interface UseAACSearchSuggestionsResult {
  suggestions: string[];
  loading: boolean;
  error: string | null;
}

export function useAACSearchSuggestions(
  client: AACSearchClient,
  query: string,
  debounceMs = 300
): UseAACSearchSuggestionsResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    const fetchSuggestions = async () => {
      try {
        const result = await client.getSearchSuggestions(query);
        setSuggestions(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch suggestions"
        );
      } finally {
        setLoading(false);
      }
    };

    debounceTimeoutRef.current = setTimeout(fetchSuggestions, debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [client, query, debounceMs]);

  return { suggestions, loading, error };
}
