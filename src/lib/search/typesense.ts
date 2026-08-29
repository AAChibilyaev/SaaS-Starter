import Typesense from "typesense";
import type {
  SearchProvider,
  SearchResult,
  SearchOptions,
  IndexableDocument,
} from "./provider";

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "localhost",
      port: parseInt(process.env.TYPESENSE_PORT || "8108", 10),
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "xyz",
  connectionTimeoutSeconds: 2,
});

const COLLECTION_NAME = "searchable_items";

async function ensureCollectionExists() {
  try {
    await client.collections(COLLECTION_NAME).retrieve();
  } catch (error) {
    if ((error as { httpStatus?: number }).httpStatus === 404) {
      await client.collections.create({
        name: COLLECTION_NAME,
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
      });
    } else {
      throw error;
    }
  }
}

export const typesenseProvider: SearchProvider = {
  async search<T = unknown>(
    options: SearchOptions,
  ): Promise<SearchResult<T>[]> {
    try {
      await ensureCollectionExists();

      const searchParams = {
        q: options.query,
        query_by: ["title", "description", "content", "searchableText"].join(
          ",",
        ),
        limit: options.limit || 10,
        offset: options.offset || 0,
        sort_by: "_text_match:desc,createdAt:desc",
      };

      // Typesense SDK requires Record<string, any> for collection types
      const results = await client.collections(COLLECTION_NAME).documents.search(
        searchParams as Parameters<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          typeof client.collections<Record<string, any>>
        >[1]["documents"]["search"][0],
      );

      return (results.hits || []).map((hit) => {
        const doc = hit.document as Record<string, unknown> & {
          id: string;
          title: string;
          type: string;
        };

        return {
          id: doc.id,
          title: doc.title,
          description: doc.description as string | undefined,
          type: doc.type,
          score: hit.text_match || 0,
          data: (doc.metadata ? JSON.parse(doc.metadata as string) : {}) as T,
        };
      });
    } catch (error) {
      console.error("Typesense search error:", error);
      return [];
    }
  },

  async indexDocument(document: IndexableDocument): Promise<void> {
    await typesenseProvider.indexDocuments([document]);
  },

  async indexDocuments(documents: IndexableDocument[]): Promise<void> {
    try {
      await ensureCollectionExists();

      const typesenseDocuments = documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        description: doc.description || "",
        content: doc.content || "",
        tags: doc.tags || [],
        metadata: doc.metadata ? JSON.stringify(doc.metadata) : "{}",
        searchableText:
          `${doc.title} ${doc.description || ""} ${doc.content || ""}`.trim(),
        createdAt: Math.floor(Date.now() / 1000),
      }));

      await client
        .collections(COLLECTION_NAME)
        .documents.import(typesenseDocuments, { action: "upsert" });
    } catch (error) {
      console.error("Typesense indexing error:", error);
      throw error;
    }
  },

  async removeDocument(id: string): Promise<void> {
    try {
      await ensureCollectionExists();
      await client.collections(COLLECTION_NAME).documents(id).delete();
    } catch (error) {
      console.error("Typesense deletion error:", error);
    }
  },

  async clearType(type: string): Promise<void> {
    try {
      await ensureCollectionExists();

      const filter = `type:=${type}`;
      await client
        .collections(COLLECTION_NAME)
        .documents.delete({ filter_by: filter });
    } catch (error) {
      console.error("Typesense clear type error:", error);
    }
  },

  async getStats() {
    try {
      await ensureCollectionExists();
      const collection = await client
        .collections(COLLECTION_NAME)
        .retrieve();

      const stats = (collection as { num_documents?: number }).num_documents || 0;

      return {
        totalDocuments: stats,
        indexedTypes: [], // Could be enriched with actual types from DB
      };
    } catch (error) {
      console.error("Typesense stats error:", error);
      return {
        totalDocuments: 0,
        indexedTypes: [],
      };
    }
  },
};
