"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ApiKeyPublic } from "@/lib/api-keys/types";
import { Copy, Trash2, TestTube2 } from "lucide-react";

interface ApiKeysListProps {
  keys: ApiKeyPublic[];
}

export function ApiKeysList({ keys }: ApiKeysListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);

  const handleCopyKey = (keyPrefix: string, lastFourChars: string) => {
    const maskedKey = `${keyPrefix}...${lastFourChars}`;
    navigator.clipboard.writeText(maskedKey);
    toast.success("Copied to clipboard");
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) {
      return;
    }

    setDeletingId(keyId);
    try {
      const response = await fetch(`/api/api-keys/${keyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "Failed to delete API key");
        return;
      }

      toast.success("API key deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the API key");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTestKey = async (keyId: string) => {
    setTestingId(keyId);
    try {
      const response = await fetch(`/api/api-keys/${keyId}/test`, {
        method: "POST",
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || "API key test failed");
        return;
      }

      toast.success("API key is valid and working");
    } catch (error) {
      toast.error("An error occurred while testing the API key");
      console.error(error);
    } finally {
      setTestingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="divide-y">
      {keys.map((key) => {
        const expired = isExpired(key.expiresAt);

        return (
          <div
            key={key.id}
            className={`p-6 flex items-center justify-between ${
              !key.isActive || expired ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-semibold">{key.name}</div>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <div>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {key.keyPrefix}...{key.lastFourChars}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Rate limit: </span>
                      <span className="font-medium">{key.rateLimit} requests/min</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                <div>
                  <span>Created: </span>
                  <span className="font-medium">{formatDate(key.createdAt)}</span>
                </div>
                {key.lastUsedAt && (
                  <div>
                    <span>Last used: </span>
                    <span className="font-medium">{formatDate(key.lastUsedAt)}</span>
                  </div>
                )}
                {key.expiresAt && (
                  <div>
                    <span>Expires: </span>
                    <span className={`font-medium ${expired ? "text-red-600" : ""}`}>
                      {formatDate(key.expiresAt)} {expired && "(Expired)"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2">
                {!key.isActive && (
                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded">
                    Revoked
                  </span>
                )}
                {key.isActive && expired && (
                  <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                    Expired
                  </span>
                )}
                {key.isActive && !expired && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    Active
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleCopyKey(key.keyPrefix, key.lastFourChars)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy key preview"
              >
                <Copy className="w-4 h-4" />
              </button>

              {key.isActive && !expired && (
                <button
                  onClick={() => handleTestKey(key.id)}
                  disabled={testingId === key.id}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  title="Test key"
                >
                  <TestTube2 className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => handleDeleteKey(key.id)}
                disabled={deletingId === key.id}
                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
