"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { AiSearchAssistant } from "@/components/dashboard/ai-search-assistant";
import { cn } from "@/lib/utils";

export function ExplorerContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState("Semantic");
  const [sortBy, setSortBy] = useState("Relevance");
  const [showAssistant, setShowAssistant] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Search Explorer
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Explore, search, and inspect your indexed data with AI assistance
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Collections & Filters */}
        <div className="border-r border-slate-200 dark:border-slate-800 w-64 overflow-y-auto bg-slate-50 dark:bg-slate-950">
          <div className="p-4">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Collections
            </h2>
            <div className="space-y-2">
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900">
                <span className="font-medium">Documents</span>
                <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                  1,234
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 p-4">
            <h2 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">
              Filters
            </h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <div className="space-y-1">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      defaultChecked
                    />
                    <span>Published</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Draft</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Search & Results */}
        <div
          className={cn(
            "flex flex-col overflow-hidden transition-all",
            showAssistant ? "flex-1" : "flex-1"
          )}
        >
          {/* Search Bar */}
          <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Search Mode
                  </label>
                  <select
                    value={searchMode}
                    onChange={(e) => setSearchMode(e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                  >
                    <option>Prefix</option>
                    <option>Infix</option>
                    <option>Exact</option>
                    <option>Semantic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-white"
                  >
                    <option>Relevance</option>
                    <option>Date (Newest)</option>
                    <option>Date (Oldest)</option>
                    <option>A-Z</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button className="rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 font-medium transition-colors">
                    Search
                  </button>
                  <button
                    onClick={() => setShowAssistant(!showAssistant)}
                    className={cn(
                      "rounded-lg px-4 py-2 font-medium transition-colors flex items-center gap-2",
                      showAssistant
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    <MessageCircle className="w-4 h-4" />
                    AI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  onClick={() => setSelectedDocument(i)}
                  className={cn(
                    "rounded-lg border bg-white dark:bg-slate-900 p-4 cursor-pointer transition-colors",
                    selectedDocument === i
                      ? "border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        Document Title {i}
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        This is a sample document preview showing key information
                        about the indexed content...
                      </p>
                      <div className="mt-3 flex gap-2">
                        <span className="inline-flex rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300">
                          Relevance: 95%
                        </span>
                        <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          Published
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-right text-sm text-slate-500 dark:text-slate-400">
                      <div>View Details</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button className="rounded border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Previous
              </button>
              <button className="rounded bg-indigo-600 px-3 py-2 text-sm text-white">
                1
              </button>
              <button className="rounded border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                2
              </button>
              <button className="rounded border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                3
              </button>
              <button className="rounded border border-slate-300 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Document Detail or AI Assistant */}
        {!showAssistant ? (
          <div className="border-l border-slate-200 dark:border-slate-800 w-80 overflow-y-auto bg-slate-50 dark:bg-slate-950">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Document Details
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {selectedDocument
                    ? `Showing details for Document ${selectedDocument}`
                    : "Select a document to view its details"}
                </p>
              </div>

              {selectedDocument && (
                <>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Schema
                    </h3>
                    <button className="w-full text-left rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
                      View Collection Schema
                    </button>
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                      Recent Searches
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="rounded bg-white dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-400">
                        query: &quot;example&quot;
                      </div>
                      <div className="rounded bg-white dark:bg-slate-900 px-3 py-2 text-slate-600 dark:text-slate-400">
                        title: &quot;test&quot;
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="border-l border-slate-200 dark:border-slate-800 w-96 overflow-hidden bg-slate-50 dark:bg-slate-950">
            <AiSearchAssistant
              onSearch={handleSearch}
              onClose={() => setShowAssistant(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
