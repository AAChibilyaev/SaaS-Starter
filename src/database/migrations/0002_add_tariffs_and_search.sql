CREATE TABLE "tariffs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"priceMonthly" numeric(10, 2) NOT NULL,
	"priceYearly" numeric(10, 2),
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"displayOrder" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tariffs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE INDEX "tariffs_slug_idx" ON "tariffs" ("slug");
--> statement-breakpoint
CREATE INDEX "tariffs_isActive_idx" ON "tariffs" ("isActive");
--> statement-breakpoint
CREATE INDEX "tariffs_displayOrder_idx" ON "tariffs" ("displayOrder");
--> statement-breakpoint
CREATE TABLE "searchable_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb,
	"isIndexed" boolean DEFAULT false NOT NULL,
	"externalId" text,
	"searchableText" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "searchable_items_type_idx" ON "searchable_items" ("type");
--> statement-breakpoint
CREATE INDEX "searchable_items_isIndexed_idx" ON "searchable_items" ("isIndexed");
--> statement-breakpoint
CREATE INDEX "searchable_items_externalId_idx" ON "searchable_items" ("externalId");
