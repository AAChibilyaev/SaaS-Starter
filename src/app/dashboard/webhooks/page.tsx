import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/database";
import { customerIntegrations } from "@/database/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Webhooks | AACSearch",
};

export default async function WebhooksPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.id;

  // Fetch webhooks
  const webhooks = await db
    .select()
    .from(customerIntegrations)
    .where(eq(customerIntegrations.userId, userId));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Webhooks</h1>
        <p className="text-gray-600 mt-2">
          Configure webhooks to receive real-time events about your account
        </p>
      </div>

      {/* Webhook Events Info */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Webhook Events</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="border-l-4 border-green-500 pl-4">
            <div className="font-bold">search.completed</div>
            <p className="text-sm text-gray-600">Triggered when a search completes</p>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <div className="font-bold">wallet.low_balance</div>
            <p className="text-sm text-gray-600">Triggered when balance drops below $5</p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <div className="font-bold">wallet.insufficient</div>
            <p className="text-sm text-gray-600">Triggered when insufficient balance for request</p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <div className="font-bold">rate_limit.exceeded</div>
            <p className="text-sm text-gray-600">Triggered when rate limit is exceeded</p>
          </div>
        </div>
      </div>

      {/* Create Webhook */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Create Webhook Endpoint</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL</label>
            <input
              type="url"
              placeholder="https://example.com/webhooks/aacsearch"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Events to Subscribe</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>search.completed</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>wallet.low_balance</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>wallet.insufficient</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>rate_limit.exceeded</span>
              </label>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Webhook
          </button>
        </div>
      </div>

      {/* Active Webhooks */}
      {webhooks.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-bold">Active Webhooks</h2>
          </div>
          <div className="divide-y">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-bold">{webhook.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{webhook.webhookUrl}</div>
                    <div className="mt-2 flex gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          webhook.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {webhook.status}
                      </span>
                      {webhook.lastUsedAt && (
                        <span className="text-xs text-gray-500">
                          Last used: {webhook.lastUsedAt.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Test
                    </button>
                    <button className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Webhook Secret */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold text-yellow-900">Important: Webhook Secret</h3>
        <p className="mt-2 text-sm text-yellow-800">
          All webhooks include a signature header (X-Webhook-Signature) for verification.
          Always verify the signature before processing webhook payloads.
        </p>
      </div>
    </div>
  );
}
