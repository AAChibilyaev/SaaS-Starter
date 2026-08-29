import { ApiDocsClient } from "./_client";

export const metadata = {
  title: "AACSearch API Documentation",
  description:
    "AACSearch API v1 - Advanced search with billing, rate limiting, usage tracking, and wallet management",
};

export default function ApiDocsPage() {
  return <ApiDocsClient />;
}
