"use client";

import { ApiReference } from "@scalar/api-reference";

export const metadata = {
  title: "AACSearch API Documentation",
  description:
    "AACSearch API v1 - Advanced search with billing, rate limiting, usage tracking, and wallet management",
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen">
      <ApiReference
        configuration={{
          spec: {
            url: "/api/openapi.json",
          },
          theme: "dark",
          layout: "classic",
          metadata: {
            og: {
              description:
                "AACSearch API v1 - Advanced search with integrated billing and rate limiting",
              image: "https://cdn.scalar.com/illustrations/scalar-og.png",
              title: "AACSearch API Documentation",
            },
          },
          servers: [
            {
              url: "https://api.example.com",
              description: "Production",
              isDefault: true,
            },
            {
              url: "http://localhost:3000",
              description: "Local development",
            },
          ],
        }}
      />
    </div>
  );
}
