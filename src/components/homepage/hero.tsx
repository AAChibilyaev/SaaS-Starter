"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Github, Terminal, Copy, Check } from "lucide-react";
import { GITHUB_URL } from "@/lib/config/constants";
import Link from "next/link";
import { useHydrated } from "@/hooks/use-hydrated";
import { ShellContainer } from "@/components/layout/page-container";

const UI_STACK_LABEL = "Powered by Next.js + Tailwind CSS";

export function Hero() {
  const [copied, setCopied] = useState(false);
  const mounted = useHydrated();
  const command = "npx create-aacsearch-app";

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-800 relative overflow-hidden border-b pt-24 pb-32 lg:pt-32 lg:pb-48">
      <ShellContainer className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Side: Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {/* Badge */}
            <div
              className={`transform transition-all duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Badge
                variant="outline"
                className="border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 mb-4 inline-flex cursor-default items-center gap-2 border px-4 py-2 font-mono text-sm font-bold transition-colors"
              >
                <span className="relative flex h-2 w-2">
                  <span className="bg-indigo-600 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                  <span className="bg-indigo-600 relative inline-flex h-2 w-2 rounded-full"></span>
                </span>
                <>Fast semantic search for developers</>
              </Badge>
            </div>

            {/* Massive Headline */}
            <h1
              className={`text-slate-900 dark:text-white mb-6 transform text-5xl leading-[0.9] font-black tracking-tighter transition-all delay-100 duration-1000 sm:text-6xl lg:text-7xl xl:text-8xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <span className="block">SEARCH</span>
              <span className="from-indigo-600 to-indigo-400 block bg-gradient-to-r bg-clip-text pr-1 text-transparent dark:from-indigo-400 dark:to-indigo-300">
                YOUR DATA
              </span>
            </h1>

            {/* Subtext */}
            <p
              className={`text-slate-600 dark:text-slate-300 mb-10 max-w-xl transform text-lg leading-relaxed transition-all delay-200 duration-1000 sm:text-xl lg:text-2xl ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <>
                AACSearch provides semantic search capabilities with a complete
                SaaS platform. Built with modern authentication, payments,
                analytics, webhooks, and rate limiting. Perfect for developers
                who need powerful search without the infrastructure headaches.
              </>
            </p>

            {/* CTAs */}
            <div
              className={`flex transform flex-col gap-4 transition-all delay-300 duration-1000 sm:flex-row lg:gap-6 ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <Button
                size="lg"
                className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 h-14 px-10 text-base font-bold shadow-lg transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-xl active:translate-x-[8px] active:translate-y-[8px] lg:h-16 lg:px-12 lg:text-lg"
                asChild
              >
                <Link href="/signup">
                  <>Get Started Free</>
                  <Terminal className="ml-3 h-5 w-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 h-14 border-2 px-10 text-base font-bold transition-colors lg:h-16 lg:px-12 lg:text-lg"
                asChild
              >
                <Link href={GITHUB_URL} target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  <>View on GitHub</>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side: Interface Preview */}
          <div
            className={`perspective-container relative w-full transform transition-all delay-500 duration-1000 ${mounted ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            {/* Main Window Interface */}
            <div className="border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 interface-3d group relative border-2 shadow-[24px_24px_0px_0px_rgb(99,102,241)]">
              {/* Window Header */}
              <div className="border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b-2 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="bg-indigo-500 h-3 w-3 rounded-full" />
                    <div className="bg-indigo-400 h-3 w-3 rounded-full opacity-60" />
                    <div className="bg-indigo-300 h-3 w-3 rounded-full opacity-30" />
                  </div>
                  <div className="bg-slate-300 dark:bg-slate-700 mx-2 h-6 w-px" />
                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2 font-mono text-sm font-bold">
                    <Terminal className="h-4 w-4" />
                    aacsearch-cli
                  </span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 hidden font-mono text-xs font-bold sm:block">
                  user@saas-starter:~/projects/my-app
                </div>
              </div>

              {/* Window Body (Split View) */}
              <div className="bg-background grid min-h-[400px] grid-cols-1 lg:grid-cols-12">
                {/* Left: Terminal Setup */}
                <div className="border-border overflow-hidden border-b p-6 text-left font-mono text-xs sm:p-8 lg:col-span-7 lg:border-r lg:border-b-0">
                  <div className="bg-secondary/30 border-border mb-6 flex items-center justify-between gap-4 border border-dashed p-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="text-primary font-bold" data-lingo-skip>
                        ➜
                      </span>
                      <span className="text-foreground truncate font-bold">
                        {command}
                      </span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground hover:text-primary flex-shrink-0 transition-colors"
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div data-lingo-skip className="space-y-2 text-xs sm:text-xs">
                    {/* Quick Start */}
                    <div className="text-muted-foreground/65">
                      <span data-lingo-skip className="text-green-500">
                        ➜
                      </span>{" "}
                      git clone https://github.com/UllrAI/SaaS-Starter.git
                    </div>
                    <div className="text-muted-foreground/65">
                      <span data-lingo-skip className="text-green-500">
                        ➜
                      </span>{" "}
                      cd saas-starter
                    </div>

                    <div className="h-4" />

                    <div className="text-muted-foreground/65">
                      <span data-lingo-skip className="text-green-500">
                        ➜
                      </span>{" "}
                      cp .env.example .env
                    </div>
                    <div className="text-muted-foreground/65">
                      <span data-lingo-skip className="text-green-500">
                        ➜
                      </span>{" "}
                      pnpm install
                    </div>

                    <div className="h-4" />

                    <div className="text-foreground font-bold">
                      <span data-lingo-skip className="text-primary">
                        ➜
                      </span>{" "}
                      pnpm dev
                    </div>

                    <div className="h-4" />

                    {/* Output */}
                    <div className="text-muted-foreground/65 space-y-1 pl-2">
                      <div data-lingo-skip className="text-green-500">
                        ✓ Ready in 1.2s
                      </div>
                      <div data-lingo-skip>
                        ○ Local:{" "}
                        <span
                          data-lingo-skip
                          className="text-primary underline"
                        >
                          http://localhost:3000
                        </span>
                      </div>
                    </div>

                    <div className="text-primary mt-6 flex animate-pulse items-center gap-2">
                      <span
                        data-lingo-skip
                        className="bg-primary block h-4 w-2"
                      />
                      <span>
                        <>Running...</>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: What's Included */}
                <div className="bg-secondary/5 flex flex-col p-6 text-left sm:p-8 lg:col-span-5">
                  <div className="mb-6 space-y-2">
                    <div className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
                      <>What&apos;s Included</>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary h-3 w-3 rounded-full" />
                      <span className="text-foreground font-bold">
                        <>Production Ready</>
                      </span>
                    </div>
                  </div>

                  {/* Features Grid */}
                  <div className="flex-1 space-y-4">
                    <div className="text-muted-foreground grid grid-cols-1 gap-3 pb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>Authentication</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>Agent-ready APIs</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>CLI Device Auth</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>Database</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>Payments</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>File Upload</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>Admin Panel</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>i18n Ready</>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary" data-lingo-skip>
                          ✓
                        </span>
                        <span>
                          <>E2E Smoke Tests</>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-border mt-auto border-t pt-6">
                    <div className="text-muted-foreground text-xs">
                      <span className="block">Built with</span>
                      <span
                        data-lingo-skip
                        className="text-primary block font-mono"
                      >
                        {UI_STACK_LABEL}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ShellContainer>
    </section>
  );
}
