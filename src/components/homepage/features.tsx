import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionContainer } from "@/components/layout/page-container";
import {
  Zap,
  CreditCard,
  Search,
  FileText,
  Gauge,
  KeyRound,
  BarChart3,
  Lock,
  Webhook,
} from "lucide-react";

function FeatureCard({
  category,
  description,
  icon: Icon,
  title,
}: {
  category: React.ReactNode;
  description: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  title: React.ReactNode;
}) {
  return (
    <Card className="group border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 dark:hover:border-indigo-500 h-full border p-6 transition-all">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 group-hover:border-indigo-500 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-600 dark:group-hover:text-white flex h-12 w-12 items-center justify-center border transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant="outline" className="border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs">
            {category}
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">{title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function Features() {
  const features = [
    {
      id: "semantic-search",
      title: <>Fast semantic search API</>,
      description: (
        <>
          Powerful semantic search with sub-second latency. Built on modern
          vector databases with support for multiple languages and relevance
          ranking.
        </>
      ),
      icon: Search,
      category: <>Core</>,
    },
    {
      id: "api-keys",
      title: <>API keys and authentication</>,
      description: (
        <>
          Secure API key management with rate limiting, expiration dates, and
          per-key configurations. Full audit trail and revocation support.
        </>
      ),
      icon: KeyRound,
      category: <>Security</>,
    },
    {
      id: "webhooks",
      title: <>Event-driven webhooks</>,
      description: (
        <>
          Receive real-time notifications on search completion, low balance
          alerts, rate limit exceeded, and more. HMAC-SHA256 signed payloads.
        </>
      ),
      icon: Webhook,
      category: <>Integration</>,
    },
    {
      id: "billing",
      title: <>Usage-based billing</>,
      description: (
        <>
          Pay only for what you use. Transparent pricing with monthly invoices,
          payment methods on file, and flexible subscription management.
        </>
      ),
      icon: CreditCard,
      category: <>Monetization</>,
    },
    {
      id: "analytics",
      title: <>Detailed analytics</>,
      description: (
        <>
          Track requests, costs, token usage, and performance metrics. Export
          reports, identify trends, and monitor your API usage in real-time.
        </>
      ),
      icon: BarChart3,
      category: <>Monitoring</>,
    },
    {
      id: "rate-limiting",
      title: <>Advanced rate limiting</>,
      description: (
        <>
          Per-minute, per-day, and monthly limits. Smart rate limiting with
          graceful degradation and Retry-After headers for predictable behavior.
        </>
      ),
      icon: Gauge,
      category: <>Control</>,
    },
    {
      id: "docs",
      title: <>Complete API documentation</>,
      description: (
        <>
          Interactive OpenAPI spec with Scalar UI. SDKs for JavaScript,
          TypeScript, React, and PHP. Example code in multiple languages.
        </>
      ),
      icon: FileText,
      category: <>Developer</>,
    },
    {
      id: "security",
      title: <>Enterprise security</>,
      description: (
        <>
          End-to-end encryption, HTTPS only, request signing, and webhook
          verification. SOC 2 compliant with regular security audits.
        </>
      ),
      icon: Lock,
      category: <>Trust</>,
    },
    {
      id: "dashboard",
      title: <>Customer dashboard</>,
      description: (
        <>
          Manage API keys, view analytics, configure webhooks, and track
          usage from an intuitive web interface.
        </>
      ),
      icon: BarChart3,
      category: <>UX</>,
    },
    {
      id: "sdks",
      title: <>SDKs for popular languages</>,
      description: (
        <>
          JavaScript, TypeScript, React, and PHP SDKs with caching, retries,
          and circuit breaker patterns built-in.
        </>
      ),
      icon: Zap,
      category: <>Developer</>,
    },
  ];

  const featureStats = [
    {
      id: "queries",
      label: <>Queries per second</>,
      value: <span data-lingo-skip>10,000+</span>,
    },
    {
      id: "latency",
      label: <>Avg response time</>,
      value: <span data-lingo-skip>50ms</span>,
    },
    {
      id: "uptime",
      label: <>99.9% uptime SLA</>,
      value: <span data-lingo-skip>Guaranteed</span>,
    },
  ];

  return (
    <section
      id="features"
      className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 border-b py-24"
    >
      <SectionContainer>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <Badge className="border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 mb-4 inline-flex items-center border px-3 py-1 text-sm backdrop-blur-sm">
            <Zap className="text-indigo-600 dark:text-indigo-400 mr-2 h-3 w-3" />
            <span className="text-indigo-700 dark:text-indigo-300 font-mono">
              POWERFUL_FEATURES
            </span>
          </Badge>

          <h2 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight sm:text-4xl">
            <>Everything you need to build search products,</>
            <span className="text-indigo-600 dark:text-indigo-400 mt-1 block">
              <>without the complexity.</>
            </span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 mt-6 text-lg">
            <>
              Production-ready search infrastructure with authentication,
              analytics, webhooks, rate limiting, and billing built-in from day
              one.
            </>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.id} {...feature} />
          ))}
        </div>

        <div className="bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 mt-16 grid gap-px border sm:grid-cols-3">
          {featureStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50 p-8 text-center transition-colors"
            >
              <div className="text-indigo-600 dark:text-indigo-400 text-4xl font-bold tracking-tighter">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400 mt-2 text-sm tracking-widest uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}
