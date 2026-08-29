# Tariff and Search System Guide

This guide explains how to use the new tariff/pricing and search features in the SaaS Starter.

## Architecture Overview

### Tariff System

The tariff system manages pricing tiers in a database-driven way:

- **Database**: `tariffs` table stores pricing information
- **API**: `/api/pricing` endpoint provides pricing data
- **UI**: `PricingGrid` component displays all available tariffs

### Search System

The search system uses **Typesense v3** as the backend, but abstracts it behind a provider interface so customers never interact with Typesense directly.

- **Provider Interface**: `src/lib/search/provider.ts` defines the contract
- **Typesense Implementation**: `src/lib/search/typesense.ts` implements the provider
- **Database**: `searchable_items` table stores indexed content metadata
- **API**: `/api/search` endpoint provides search functionality

## Quick Start

### 1. Set Up Typesense

You have two options:

**Option A: Docker (Recommended for development)**
```bash
docker run -p 8108:8108 -v /tmp/typesense-data:/data typesense/typesense:latest \
  --data-dir /data --api-key xyz
```

**Option B: Local Binary**
Download from https://typesense.org/downloads/ and run the server.

### 2. Configure Environment Variables

Add to `.env.local`:
```env
TYPESENSE_HOST=localhost
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http
TYPESENSE_API_KEY=xyz
```

### 3. Set Up Pricing Tiers

Use the API to create pricing tiers:

```bash
curl -X POST http://localhost:3000/api/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "starter",
    "name": "Starter",
    "description": "Perfect for individuals",
    "priceMonthly": 29,
    "priceYearly": 290,
    "features": ["Feature 1", "Feature 2"],
    "displayOrder": 1
  }'
```

Or use the `PricingGrid` component in your pages:

```tsx
import { PricingGrid } from "@/components/pricing/pricing-grid";

export default function PricingPage() {
  return (
    <div className="py-20">
      <h1>Our Pricing</h1>
      <PricingGrid />
    </div>
  );
}
```

### 4. Index Content for Search

To make content searchable, use the `/api/search/index` endpoint:

```bash
curl -X POST http://localhost:3000/api/search/index \
  -H "Content-Type: application/json" \
  -d '{
    "type": "documentation",
    "items": [
      {
        "id": "doc-1",
        "type": "documentation",
        "title": "Getting Started",
        "description": "Learn how to get started",
        "content": "Full documentation content...",
        "tags": ["tutorial", "beginner"],
        "metadata": { "url": "/docs/getting-started" }
      }
    ]
  }'
```

### 5. Perform Searches

Use the search API or the React components:

**API:**
```bash
curl "http://localhost:3000/api/search?q=getting%20started&limit=10"
```

**React Component:**
```tsx
"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="py-10">
      <SearchBar onSearch={setQuery} />
      <SearchResults query={query} />
    </div>
  );
}
```

## API Reference

### Pricing API

**GET /api/pricing**
Returns all active pricing tiers.

Response:
```json
[
  {
    "id": "uuid",
    "slug": "starter",
    "name": "Starter",
    "description": "string",
    "priceMonthly": 29,
    "priceYearly": 290,
    "features": ["Feature 1", "Feature 2"],
    "displayOrder": 1
  }
]
```

**POST /api/pricing** (Admin only)
Creates a new pricing tier.

### Search API

**GET /api/search?q=query&limit=10&offset=0**
Searches indexed content.

Response:
```json
{
  "query": "query",
  "count": 2,
  "results": [
    {
      "id": "doc-1",
      "title": "Getting Started",
      "description": "Learn how to get started",
      "type": "documentation",
      "score": 45.23,
      "data": { "url": "/docs/getting-started" }
    }
  ]
}
```

**POST /api/search/index** (Admin only)
Indexes new documents or updates existing ones.

Body:
```json
{
  "type": "documentation",
  "items": [
    {
      "id": "unique-id",
      "type": "documentation",
      "title": "Title",
      "description": "Description",
      "content": "Full content for indexing",
      "tags": ["tag1", "tag2"],
      "metadata": {}
    }
  ]
}
```

**GET /api/search/index**
Returns search statistics.

## Provider Pattern

The search system follows the same provider pattern as the billing system:

```typescript
import { searchProvider } from "@/lib/search";

// Search
const results = await searchProvider.search({
  query: "hello world",
  limit: 10,
  offset: 0,
});

// Index documents
await searchProvider.indexDocument({
  id: "doc-1",
  type: "documentation",
  title: "My Document",
  content: "Content here",
});

// Clear all documents of a type
await searchProvider.clearType("documentation");

// Get stats
const stats = await searchProvider.getStats();
```

## Components

### PricingCard
Displays a single pricing tier with features and CTA.

```tsx
<PricingCard
  name="Starter"
  priceMonthly={29}
  features={["Feature 1", "Feature 2"]}
  slug="starter"
  isPopular={true}
/>
```

### PricingGrid
Displays all pricing tiers fetched from the API.

```tsx
<PricingGrid />
```

### SearchBar
Input field for search queries.

```tsx
<SearchBar
  onSearch={(query) => setQuery(query)}
  placeholder="Search documentation..."
/>
```

### SearchResults
Displays search results.

```tsx
<SearchResults query="search term" />
```

## Database Schema

### tariffs

```sql
- id (UUID, PK)
- slug (TEXT, UNIQUE)
- name (TEXT)
- description (TEXT)
- priceMonthly (NUMERIC)
- priceYearly (NUMERIC, optional)
- features (JSONB array)
- isActive (BOOLEAN)
- displayOrder (INTEGER)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

### searchable_items

```sql
- id (UUID, PK)
- type (TEXT)
- title (TEXT)
- description (TEXT)
- content (TEXT)
- tags (JSONB array)
- metadata (JSONB)
- isIndexed (BOOLEAN)
- externalId (TEXT)
- searchableText (TEXT)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

## Typesense Configuration

The Typesense provider automatically:
- Creates the `searchable_items` collection on first use
- Defines fields for title, description, content, tags, and metadata
- Indexes documents with full-text search capabilities
- Supports faceted search by type and tags

The collection schema:
```typescript
{
  name: "searchable_items",
  fields: [
    { name: "id", type: "string" },
    { name: "type", type: "string", facet: true },
    { name: "title", type: "string" },
    { name: "description", type: "string", optional: true },
    { name: "content", type: "string", optional: true },
    { name: "tags", type: "string[]", facet: true, optional: true },
    { name: "metadata", type: "string", optional: true },
    { name: "searchableText", type: "string", optional: true },
    { name: "createdAt", type: "int64" },
  ],
  default_sorting_field: "createdAt",
}
```

## Best Practices

1. **Tariffs**: Keep the number of tiers between 2-5 for optimal UX
2. **Features**: Make feature names clear and benefit-focused
3. **Search**: Index content regularly to keep search results fresh
4. **Tags**: Use consistent, lowercase tags for better organization
5. **Metadata**: Store URLs and IDs in metadata for easy linking

## Troubleshooting

**Typesense connection fails:**
- Check if Typesense server is running
- Verify `TYPESENSE_HOST`, `TYPESENSE_PORT`, and `TYPESENSE_API_KEY`
- Check network connectivity

**Search returns no results:**
- Verify documents are indexed via `/api/search/index`
- Check search query spelling
- Review `isIndexed` flag in `searchable_items` table

**Pricing API returns empty:**
- Check if tariffs exist in the database
- Verify `isActive` is set to true
- Check `displayOrder` values

## Migration

If migrating from another search provider:

1. Export existing content
2. Transform to the required format
3. Use `/api/search/index` to bulk index
4. Test search functionality
5. Update UI components to use new search API
