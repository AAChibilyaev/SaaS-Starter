import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CustomerService } from "@/lib/customer/service";
import { db } from "@/database";
import { apiKeys } from "@/database/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Search Dashboard | AACSearch",
};

export default async function SearchDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.id;

  // Fetch wallet info
  const wallet = await CustomerService.getOrCreateWallet(userId);

  // Fetch usage stats
  const usage = await CustomerService.getUsageStats(userId, 30);

  // Fetch rate limits
  const rateLimit = await CustomerService.getOrCreateRateLimit(userId);

  // Fetch API keys
  const keys = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your search API and track usage</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Wallet Balance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Wallet Balance</div>
          <div className="text-3xl font-bold mt-2">
            ${wallet.balance.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {wallet.balance < 5 && "⚠️ Add funds soon"}
            {wallet.balance >= 5 && "Sufficient balance"}
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">30-Day Spending</div>
          <div className="text-3xl font-bold mt-2">
            ${usage.totalCost.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Across {usage.operations.length} operation types
          </div>
        </div>

        {/* Requests Per Minute */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Requests/Min</div>
          <div className="text-3xl font-bold mt-2">{rateLimit.requestsPerMinute}</div>
          <div className="text-xs text-gray-500 mt-2">
            {Math.floor(rateLimit.requestsPerMinute / 60)} per second
          </div>
        </div>

        {/* Monthly Token Limit */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-600">Monthly Tokens</div>
          <div className="text-3xl font-bold mt-2">
            {(rateLimit.monthlyTokenLimit / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {rateLimit.monthlyTokenLimit.toLocaleString()} total
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">API Keys</h2>
          <p className="text-sm text-gray-600 mt-1">
            Use API keys to authenticate requests to the AACSearch API
          </p>
        </div>

        <div className="px-6 py-4">
          {keys.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No API keys yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Create your first API key to start using AACSearch
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <div className="font-medium">{key.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      sk_live_...{key.lastFourChars}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {key.lastUsedAt ? `Last used: ${key.lastUsedAt.toLocaleDateString()}` : "Never used"}
                      {key.expiresAt && ` • Expires: ${key.expiresAt.toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Copy
                    </button>
                    <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create New Key
          </button>
        </div>
      </div>

      {/* Usage Details */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Usage (Last 30 Days)</h2>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-3">
            {usage.operations.map((op) => (
              <div
                key={op.type}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium capitalize">{op.type}</div>
                  <div className="text-sm text-gray-600">
                    {op.count} operations • {op.totalTokens.toLocaleString()} tokens
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${op.totalCost.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>

          {usage.operations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No usage data available
            </div>
          )}
        </div>
      </div>

      {/* Rate Limits Info */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Rate Limits</h2>
        </div>

        <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Per Minute</div>
            <div className="text-2xl font-bold mt-1">{rateLimit.requestsPerMinute}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Per Day</div>
            <div className="text-2xl font-bold mt-1">
              {(rateLimit.requestsPerDay / 1000).toFixed(0)}K
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Concurrent</div>
            <div className="text-2xl font-bold mt-1">{rateLimit.concurrentRequests}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Monthly Tokens</div>
            <div className="text-2xl font-bold mt-1">
              {(rateLimit.monthlyTokenLimit / 1000000).toFixed(1)}M
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
