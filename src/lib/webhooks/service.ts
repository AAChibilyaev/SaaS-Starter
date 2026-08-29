import { db } from "@/database";
import { customerIntegrations } from "@/database/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import type { WebhookRow } from "@/lib/webhooks/types";

export interface WebhookEvent {
  type:
    | "search.completed"
    | "wallet.low_balance"
    | "wallet.insufficient"
    | "rate_limit.exceeded";
  userId: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface WebhookPayload {
  id: string;
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
  signature: string;
}

export class WebhookService {
  /**
   * Trigger webhook event for user
   */
  static async triggerEvent(event: WebhookEvent): Promise<void> {
    try {
      // Get all active webhooks for user
      const webhooks = await db
        .select()
        .from(customerIntegrations)
        .where(eq(customerIntegrations.userId, event.userId));

      const activeWebhooks = webhooks.filter((w) => w.status === "active" && w.webhookUrl);

      for (const webhook of activeWebhooks) {
        // Send webhook asynchronously
        this.sendWebhook(webhook, event).catch((error) => {
          console.error(`Failed to send webhook ${webhook.id}:`, error);
        });
      }

      // Update last used time
      if (activeWebhooks.length > 0) {
        await db
          .update(customerIntegrations)
          .set({ lastUsedAt: new Date() })
          .where(eq(customerIntegrations.userId, event.userId));
      }
    } catch (error) {
      console.error("Webhook trigger error:", error);
    }
  }

  /**
   * Send webhook to endpoint
   */
  private static async sendWebhook(
    webhook: WebhookRow,
    event: WebhookEvent
  ): Promise<void> {
    const payload: WebhookPayload = {
      id: crypto.randomUUID(),
      type: event.type,
      timestamp: event.timestamp.toISOString(),
      data: event.data,
      signature: "", // Will be set below
    };

    // Generate signature
    const secret = webhook.webhookSecret || "";
    const signature = crypto
      .createHmac("sha256", secret)
      .update(JSON.stringify(payload))
      .digest("hex");

    payload.signature = signature;

    // Send POST request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      const response = await fetch(webhook.webhookUrl || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Event": event.type,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.warn(`Webhook failed with status ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Verify webhook signature
   */
  static verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return signature === expectedSignature;
  }

  static async getWebhookEvents() {
    return [];
  }
}
