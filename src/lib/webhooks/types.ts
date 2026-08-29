import type { customerIntegrations } from "@/database/schema";

export type WebhookRow = typeof customerIntegrations.$inferSelect;
