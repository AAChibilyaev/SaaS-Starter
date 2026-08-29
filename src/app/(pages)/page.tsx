import { Hero } from "@/components/homepage/hero";
import { SocialProofUnified } from "@/components/homepage/social-proof-testimonials";
import { Features } from "@/components/homepage/features";
import { OtherProducts } from "@/components/homepage/other-products";
import { CallToAction } from "@/components/homepage/call-to-action";
import { createLocalizedAlternates, createMetadata } from "@/lib/metadata";
import { getRequestLocale } from "@/lib/i18n/server-locale";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  const metadata = createMetadata({
    alternates: createLocalizedAlternates("/", locale),
  });

  return {
    ...metadata,
    title: "AACSearch - Semantic Search API",
    description:
      "Fast, semantic search API with complete SaaS infrastructure. Built-in authentication, payments, analytics, webhooks, and rate limiting. Production-ready from day one.",
    openGraph: {
      ...metadata.openGraph,
      title: "AACSearch - Semantic Search API",
      description:
        "Fast, semantic search API with complete SaaS infrastructure. Built-in authentication, payments, analytics, webhooks, and rate limiting. Production-ready from day one.",
    },
    twitter: {
      ...metadata.twitter,
      title: "AACSearch - Semantic Search API",
      description:
        "Fast, semantic search API with complete SaaS infrastructure. Built-in authentication, payments, analytics, webhooks, and rate limiting. Production-ready from day one.",
    },
  };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <SocialProofUnified />
      <Features />
      <OtherProducts />
      <CallToAction />
    </>
  );
}
