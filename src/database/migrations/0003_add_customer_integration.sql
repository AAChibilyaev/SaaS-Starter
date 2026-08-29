CREATE TABLE "customer_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"balance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"totalSpent" numeric(12, 2) DEFAULT '0' NOT NULL,
	"totalEarned" numeric(12, 2) DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "customer_wallets_userId_idx" ON "customer_wallets" ("userId");
--> statement-breakpoint
CREATE TABLE "usage_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"apiKeyId" uuid,
	"operationType" text NOT NULL,
	"cost" numeric(10, 2) NOT NULL,
	"tokensUsed" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "usage_records_userId_idx" ON "usage_records" ("userId");
--> statement-breakpoint
CREATE INDEX "usage_records_apiKeyId_idx" ON "usage_records" ("apiKeyId");
--> statement-breakpoint
CREATE INDEX "usage_records_timestamp_idx" ON "usage_records" ("timestamp");
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"planId" text,
	"requestsPerMinute" integer DEFAULT 100 NOT NULL,
	"requestsPerDay" integer DEFAULT 10000 NOT NULL,
	"monthlyTokenLimit" integer DEFAULT 1000000 NOT NULL,
	"concurrentRequests" integer DEFAULT 10 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "rate_limits_userId_idx" ON "rate_limits" ("userId");
--> statement-breakpoint
CREATE INDEX "rate_limits_planId_idx" ON "rate_limits" ("planId");
--> statement-breakpoint
CREATE TABLE "customer_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"lastUsedAt" timestamp,
	"webhookUrl" text,
	"webhookSecret" text,
	"metadata" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "customer_integrations_userId_idx" ON "customer_integrations" ("userId");
--> statement-breakpoint
CREATE INDEX "customer_integrations_type_idx" ON "customer_integrations" ("type");
