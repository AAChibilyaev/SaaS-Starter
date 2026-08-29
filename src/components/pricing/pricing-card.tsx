import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  description?: string;
  priceMonthly: number;
  priceYearly?: number;
  features: string[];
  slug: string;
  isPopular?: boolean;
}

export function PricingCard({
  name,
  description,
  priceMonthly,
  priceYearly,
  features,
  slug,
  isPopular = false,
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-lg border p-8 ${isPopular ? "border-primary shadow-lg ring-1 ring-primary" : "border-border"}`}
    >
      {isPopular && (
        <div className="bg-primary text-primary-foreground absolute -top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold">
          <>Most Popular</>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-foreground text-xl font-bold">{name}</h3>
        {description && (
          <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        )}
      </div>

      <div className="mb-6">
        <div className="text-foreground text-3xl font-bold">
          ${priceMonthly.toFixed(2)}
        </div>
        <p className="text-muted-foreground text-sm">per month</p>
        {priceYearly && (
          <p className="text-muted-foreground mt-2 text-xs">
            or ${priceYearly.toFixed(2)} yearly
          </p>
        )}
      </div>

      <ul className="text-muted-foreground mb-6 flex-1 space-y-3 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="text-primary mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button asChild className="w-full" variant={isPopular ? "default" : "outline"}>
        <Link href={`/signup?plan=${slug}`}>
          <>Get Started</>
        </Link>
      </Button>
    </div>
  );
}
