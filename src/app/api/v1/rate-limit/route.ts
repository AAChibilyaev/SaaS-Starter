import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/lib/customer/service";
import { validateApiKey } from "@/lib/auth/api-key";

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.split(" ")[1];
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }

    const userId = await validateApiKey(apiKey);
    if (!userId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    const limit = await CustomerService.getOrCreateRateLimit(userId);
    return NextResponse.json(limit);
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate limit" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get("authorization")?.split(" ")[1];
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }

    const userId = await validateApiKey(apiKey);
    if (!userId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // This checks if user can make request based on rate limits
    // In production, implement actual rate limiting logic
    const limit = await CustomerService.getOrCreateRateLimit(userId);
    return NextResponse.json({
      allowed: true,
      nextResetAt: new Date(Date.now() + 60 * 1000), // Reset in 1 minute
      remaining: limit.requestsPerMinute - 1,
    });
  } catch (error) {
    console.error("Rate limit check error:", error);
    return NextResponse.json(
      { error: "Rate limit check failed" },
      { status: 500 },
    );
  }
}
