"use client";

import { useState, useEffect } from "react";
import type { SearchResult } from "@/lib/search";

interface SearchResultsProps {
  query: string;
  onResultClick?: (result: SearchResult) => void;
}

export function SearchResults({ query, onResultClick }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    async function performSearch() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: query,
          limit: "20",
        });

        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search error");
        setResults([]);
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  if (loading) {
    return <div className="text-muted-foreground text-center py-8">Searching...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center py-8">Error: {error}</div>;
  }

  if (results.length === 0) {
    return (
      <div className="text-muted-foreground text-center py-8">
        {query ? "No results found" : "Enter a search query"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="border-border hover:bg-secondary/50 cursor-pointer rounded-lg border p-4 transition-colors"
          onClick={() => onResultClick?.(result)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-foreground font-semibold">{result.title}</h3>
              <p className="text-muted-foreground text-sm">
                {result.description}
              </p>
              <div className="text-muted-foreground mt-2 flex gap-2 text-xs">
                <span className="bg-secondary rounded px-2 py-1">{result.type}</span>
                <span className="text-muted-foreground">
                  Score: {result.score.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
