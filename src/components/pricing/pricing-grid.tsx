"use client";

import { useEffect, useState } from "react";
import { PricingCard } from "./pricing-card";

interface Tariff {
  id: string;
  slug: string;
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  features: string[];
  displayOrder: number;
}

export function PricingGrid() {
  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTariffs() {
      try {
        const response = await fetch("/api/pricing");
        if (!response.ok) throw new Error("Failed to fetch pricing");

        const data = await response.json();
        setTariffs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchTariffs();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground text-center">Loading pricing...</div>;
  }

  if (error) {
    return <div className="text-destructive text-center">Error: {error}</div>;
  }

  if (tariffs.length === 0) {
    return <div className="text-muted-foreground text-center">No pricing tiers available</div>;
  }

  // Find the most popular tier (middle one for 3 tiers, or marked explicitly)
  const mostPopularIndex = Math.floor(tariffs.length / 2);

  return (
    <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      {tariffs.map((tariff, index) => (
        <PricingCard
          key={tariff.id}
          name={tariff.name}
          description={tariff.description}
          priceMonthly={tariff.priceMonthly}
          priceYearly={tariff.priceYearly}
          features={tariff.features}
          slug={tariff.slug}
          isPopular={index === mostPopularIndex}
        />
      ))}
    </div>
  );
}
