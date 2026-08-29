import { db } from "@/database";
import { apiKeys } from "@/database/schema";
import { eq, and, gt } from "drizzle-orm";
import crypto from "crypto";

/**
 * Validate an API key and return the user ID if valid
 */
export async function validateApiKey(keyPrefix: string): Promise<string | null> {
  try {
    // API keys are in format: sk_live_xxxxx_hash
    // Extract the prefix to find the key
    const keys = await db
      .select()
      .from(apiKeys)
      .where(and(
        eq(apiKeys.keyPrefix, keyPrefix),
        eq(apiKeys.isActive, true),
        gt(apiKeys.expiresAt, new Date()),
      ));

    if (keys.length === 0) {
      return null;
    }

    // Update last used time
    const key = keys[0];
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.id, key.id));

    return key.userId;
  } catch {
    return null;
  }
}

/**
 * Generate a new API key
 */
export async function generateApiKey(
  userId: string,
  name: string,
  expiresAt?: Date,
): Promise<{ key: string; id: string }> {
  const keyPrefix = `sk_${crypto.randomBytes(16).toString("hex")}`;
  const keyHash = crypto
    .createHash("sha256")
    .update(keyPrefix)
    .digest("hex");
  const lastFourChars = keyPrefix.slice(-4);

  const created = await db
    .insert(apiKeys)
    .values({
      userId,
      name,
      keyPrefix,
      keyHash,
      lastFourChars,
      expiresAt: expiresAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    })
    .returning();

  return {
    key: keyPrefix,
    id: created[0].id,
  };
}

/**
 * Revoke an API key
 */
export async function revokeApiKey(keyId: string): Promise<void> {
  await db
    .update(apiKeys)
    .set({ isActive: false })
    .where(eq(apiKeys.id, keyId));
}
