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

    const days = request.nextUrl.searchParams.get("days");
    const stats = await CustomerService.getUsageStats(
      userId,
      days ? parseInt(days, 10) : 30,
    );

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Usage error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 },
    );
  }
}
