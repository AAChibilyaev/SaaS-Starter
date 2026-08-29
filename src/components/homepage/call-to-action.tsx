import React from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { SectionContainer } from "@/components/layout/page-container";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function CallToAction() {
  const proofPoints = [
    { id: "fast", label: <>Sub-second latency</> },
    { id: "scalable", label: <>10k+ QPS</> },
    { id: "reliable", label: <>99.9% uptime SLA</> },
  ];

  return (
    <section className="border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-t">
      <SectionContainer className="py-24 sm:py-32">
        <div className="text-center">
          <div className="border-indigo-300 dark:border-indigo-700 bg-indigo-100 dark:bg-indigo-950 mx-auto flex h-16 w-16 items-center justify-center border">
            <Logo className="text-indigo-600 dark:text-indigo-400 h-10 w-10" variant="icon-only" />
          </div>

          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold tracking-[0.2em] uppercase">
              <>Ready for production</>
            </p>
            <h2 className="text-slate-900 dark:text-white text-4xl font-bold tracking-tight sm:text-5xl">
              <>Launch your search product in days, not months</>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed sm:text-xl">
              <>
                AACSearch includes everything: APIs, SDKs, authentication,
                payments, analytics, webhooks, and rate limiting. Focus on your
                product, not infrastructure.
              </>
            </p>
          </div>

          <div className="text-slate-700 dark:text-slate-300 mt-8 flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            {proofPoints.map(({ id, label }) => (
              <span key={id} className="inline-flex items-center gap-2">
                <CheckCircle className="text-indigo-600 dark:text-indigo-400 h-4 w-4" />
                {label}
              </span>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="group bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-14 px-10 text-base font-bold shadow-lg transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-md active:translate-x-[4px] active:translate-y-[4px]"
              asChild
            >
              <Link href="/pricing">
                <>Start free trial</>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 h-14 border-2 px-10 text-base font-bold transition-colors"
              asChild
            >
              <Link href="/features">
                <>Explore features</>
              </Link>
            </Button>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mt-6 text-sm">
            <>
              Source code included. Deploy on your infrastructure or use our
              hosted service.
            </>
          </p>
        </div>
      </SectionContainer>
    </section>
  );
}
