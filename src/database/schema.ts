import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  uuid,
  index,
  pgEnum,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";

// 定义用户角色枚举
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "admin",
  "super_admin",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: userRoleEnum("role").notNull().default("user"),
  banned: boolean("banned").notNull().default(false),
  banReason: text("banReason"),
  banExpires: timestamp("banExpires"),
  paymentProviderCustomerId: text("paymentProviderCustomerId").unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull(),
  updatedAt: timestamp("updatedAt").notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  // Pre-parsed userAgent fields for performance optimization
  os: text("os"),
  browser: text("browser"),
  deviceType: text("deviceType"),
  impersonatedBy: text("impersonatedBy"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable(
  "accounts",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => {
    return {
      userIdx: index("accounts_userId_idx").on(table.userId),
    };
  },
);

export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    keyPrefix: text("keyPrefix").notNull(),
    keyHash: text("keyHash").notNull(),
    lastFourChars: text("lastFourChars").notNull(),
    rateLimit: integer("rateLimit").notNull().default(60),
    isActive: boolean("isActive").notNull().default(true),
    lastUsedAt: timestamp("lastUsedAt"),
    expiresAt: timestamp("expiresAt"),
    requestCountInWindow: integer("requestCountInWindow")
      .notNull()
      .default(0),
    windowStartedAt: timestamp("windowStartedAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("api_keys_userId_idx").on(table.userId),
      keyHashIdx: index("api_keys_keyHash_idx").on(table.keyHash),
    };
  },
);

export const deviceCodes = pgTable(
  "device_codes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    deviceCode: text("deviceCode").notNull().unique(),
    userCode: text("userCode").notNull().unique(),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    interval: integer("interval").notNull().default(5),
    lastPolledAt: timestamp("lastPolledAt"),
    attempts: integer("attempts").notNull().default(0),
    clientName: text("clientName"),
    clientVersion: text("clientVersion"),
    deviceOs: text("deviceOs"),
    deviceHostname: text("deviceHostname"),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      expiresAtIdx: index("device_codes_expiresAt_idx").on(table.expiresAt),
    };
  },
);

export const cliTokens = pgTable(
  "cli_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    tokenHash: text("tokenHash").notNull().unique(),
    tokenPrefix: text("tokenPrefix").notNull(),
    lastFourChars: text("lastFourChars").notNull(),
    refreshTokenHash: text("refreshTokenHash").notNull().unique(),
    previousRefreshTokenHash: text("previousRefreshTokenHash"),
    refreshRotatedAt: timestamp("refreshRotatedAt"),
    isActive: boolean("isActive").notNull().default(true),
    expiresAt: timestamp("expiresAt").notNull(),
    refreshExpiresAt: timestamp("refreshExpiresAt").notNull(),
    lastUsedAt: timestamp("lastUsedAt"),
    deviceOs: text("deviceOs"),
    deviceHostname: text("deviceHostname"),
    cliVersion: text("cliVersion"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("cli_tokens_userId_idx").on(table.userId),
    };
  },
);

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt"),
  updatedAt: timestamp("updatedAt"),
});

// Subscription table to store user subscription information
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customerId: text("customerId").notNull(),
    subscriptionId: text("subscriptionId").notNull().unique(),
    productId: text("productId").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("currentPeriodStart"),
    currentPeriodEnd: timestamp("currentPeriodEnd"),
    canceledAt: timestamp("canceledAt"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("subscriptions_userId_idx").on(table.userId),
      customerIdIdx: index("subscriptions_customerId_idx").on(table.customerId),
    };
  },
);

// Payment records table to store payment history
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customerId: text("customerId").notNull(),
    subscriptionId: text("subscriptionId"),
    productId: text("productId").notNull(),
    paymentId: text("paymentId").notNull().unique(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("usd"),
    status: text("status").notNull(),
    paymentType: text("paymentType").notNull(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("payments_userId_idx").on(table.userId),
    };
  },
);

// Webhook events table to ensure idempotency
export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: text("eventId").notNull().unique(), // Unique identifier from webhook provider
    eventType: text("eventType").notNull(),
    provider: text("provider").notNull().default("creem"), // Support multiple providers
    processed: boolean("processed").notNull().default(true),
    processedAt: timestamp("processedAt").notNull().defaultNow(),
    payload: text("payload"), // Store original payload for debugging
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      eventIdIdx: index("webhook_events_eventId_idx").on(table.eventId),
      providerIdx: index("webhook_events_provider_idx").on(table.provider),
    };
  },
);

// File uploads table to store uploaded file metadata
export const uploads = pgTable(
  "uploads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    fileKey: text("fileKey").notNull(), // Key in R2 storage
    url: text("url").notNull(), // Public access URL
    fileName: text("fileName").notNull(), // Original file name
    fileSize: integer("fileSize").notNull(), // File size in bytes
    contentType: text("contentType").notNull(), // MIME type
    createdAt: timestamp("createdAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("uploads_userId_idx").on(table.userId),
      fileKeyIdx: index("uploads_fileKey_idx").on(table.fileKey),
    };
  },
);

// Tariffs table to store pricing tiers
export const tariffs = pgTable(
  "tariffs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    priceMonthly: numeric("priceMonthly", {
      precision: 10,
      scale: 2,
    }).notNull(),
    priceYearly: numeric("priceYearly", {
      precision: 10,
      scale: 2,
    }),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    isActive: boolean("isActive").notNull().default(true),
    displayOrder: integer("displayOrder").notNull().default(0),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("tariffs_slug_idx").on(table.slug),
      isActiveIdx: index("tariffs_isActive_idx").on(table.isActive),
      displayOrderIdx: index("tariffs_displayOrder_idx").on(table.displayOrder),
    };
  },
);

// Searchable items table for indexing content
export const searchableItems = pgTable(
  "searchable_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: text("type").notNull(), // 'user', 'plan', 'documentation', etc.
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"), // Full content for indexing
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    isIndexed: boolean("isIndexed").notNull().default(false),
    externalId: text("externalId"), // Reference to original object
    searchableText: text("searchableText"), // Denormalized text for full-text search
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      typeIdx: index("searchable_items_type_idx").on(table.type),
      isIndexedIdx: index("searchable_items_isIndexed_idx").on(table.isIndexed),
      externalIdIdx: index("searchable_items_externalId_idx").on(table.externalId),
    };
  },
);

// Customer wallet table for tracking credits/balance
export const customerWallets = pgTable(
  "customer_wallets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    balance: numeric("balance", { precision: 12, scale: 2 }).notNull().default("0"),
    currency: text("currency").notNull().default("usd"),
    totalSpent: numeric("totalSpent", { precision: 12, scale: 2 }).notNull().default("0"),
    totalEarned: numeric("totalEarned", { precision: 12, scale: 2 }).notNull().default("0"),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("customer_wallets_userId_idx").on(table.userId),
    };
  },
);

// Usage tracking table for rate limiting and billing
export const usageRecords = pgTable(
  "usage_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    apiKeyId: uuid("apiKeyId"),
    operationType: text("operationType").notNull(), // 'search', 'index', 'delete', etc.
    cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
    tokensUsed: integer("tokensUsed").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    timestamp: timestamp("timestamp").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("usage_records_userId_idx").on(table.userId),
      apiKeyIdx: index("usage_records_apiKeyId_idx").on(table.apiKeyId),
      timestampIdx: index("usage_records_timestamp_idx").on(table.timestamp),
    };
  },
);

// Rate limit configuration per user/plan
export const rateLimits = pgTable(
  "rate_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: text("planId"), // Link to tariff/plan
    requestsPerMinute: integer("requestsPerMinute").notNull().default(100),
    requestsPerDay: integer("requestsPerDay").notNull().default(10000),
    monthlyTokenLimit: integer("monthlyTokenLimit").notNull().default(1000000),
    concurrentRequests: integer("concurrentRequests").notNull().default(10),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("rate_limits_userId_idx").on(table.userId),
      planIdx: index("rate_limits_planId_idx").on(table.planId),
    };
  },
);

// Customer integrations tracking (SDK usage, webhooks, etc.)
export const customerIntegrations = pgTable(
  "customer_integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: text("type").notNull(), // 'javascript', 'python', 'api', etc.
    status: text("status").notNull().default("active"), // 'active', 'paused', 'failed'
    lastUsedAt: timestamp("lastUsedAt"),
    webhookUrl: text("webhookUrl"),
    webhookSecret: text("webhookSecret"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdx: index("customer_integrations_userId_idx").on(table.userId),
      typeIdx: index("customer_integrations_type_idx").on(table.type),
    };
  },
);
