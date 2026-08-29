import { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/database";
import { apiKeys } from "@/database/schema";
import { eq } from "drizzle-orm";
import { CreateApiKeyForm } from "@/components/forms/create-api-key-form";
import { ApiKeysList } from "@/components/dashboard/api-keys-list";

export const metadata: Metadata = {
  title: "API Keys | AACSearch",
};

export default async function ApiKeysPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");

  const userId = session.user.id;

  // Fetch all API keys for user
  const userKeys = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">API Keys</h1>
        <p className="text-gray-600 mt-2">
          Create and manage API keys for authenticating requests to AACSearch
        </p>
      </div>

      {/* Create New Key Section */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Create New API Key</h2>
        </div>
        <div className="p-6">
          <CreateApiKeyForm />
        </div>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold">Your API Keys</h2>
          <p className="text-sm text-gray-600 mt-1">
            {userKeys.length} key{userKeys.length !== 1 ? "s" : ""} created
          </p>
        </div>

        {userKeys.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No API keys created yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Create your first API key above to start using AACSearch
            </p>
          </div>
        ) : (
          <ApiKeysList keys={userKeys} />
        )}
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-blue-900">Security Tips</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800">
          <li>• Never share your API keys publicly</li>
          <li>• Use environment variables to store keys</li>
          <li>• Rotate keys regularly for security</li>
          <li>• Set expiration dates on keys</li>
          <li>• Revoke unused keys immediately</li>
          <li>• Use separate keys for production and testing</li>
        </ul>
      </div>
    </div>
  );
}
