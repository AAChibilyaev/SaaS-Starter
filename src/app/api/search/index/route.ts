import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { searchableItems } from "@/database/schema";
import { searchProvider } from "@/lib/search";

export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication/authorization check for admin only
    const body = await request.json();

    const { type, items } = body as {
      type?: string;
      items: Array<{
        id: string;
        type: string;
        title: string;
        description?: string;
        content?: string;
        tags?: string[];
        metadata?: Record<string, unknown>;
      }>;
    };

    // If type is specified, clear previous items of that type
    if (type) {
      await searchProvider.clearType(type);
    }

    // Index documents in search provider
    await searchProvider.indexDocuments(items);

    // Also persist to database for reference
    const itemsToInsert = items.map((item) => ({
      type: item.type,
      title: item.title,
      description: item.description,
      content: item.content,
      tags: item.tags || [],
      metadata: item.metadata,
      externalId: item.id,
      isIndexed: true,
      searchableText: `${item.title} ${item.description || ""} ${item.content || ""}`.trim(),
    }));

    await db.insert(searchableItems).values(itemsToInsert);

    return NextResponse.json({
      success: true,
      indexed: items.length,
    });
  } catch (error) {
    console.error("Indexing error:", error);
    return NextResponse.json(
      { error: "Indexing failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const stats = await searchProvider.getStats();

    return NextResponse.json({
      search: stats,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
