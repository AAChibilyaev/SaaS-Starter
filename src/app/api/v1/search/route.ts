import { NextRequest, NextResponse } from "next/server";
import { searchProvider } from "@/lib/search";
import { CustomerService } from "@/lib/customer/service";
import { validateApiKey } from "@/lib/auth/api-key";

// Cost configuration
const SEARCH_COST = 0.01; // $0.01 per search
const TOKEN_COST = 0.0001; // $0.0001 per token

export async function GET(request: NextRequest) {
  try {
    // Authenticate with API key
    const apiKey = request.headers.get("authorization")?.split(" ")[1];
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 401 },
      );
    }

    const userId = await validateApiKey(apiKey);
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 },
      );
    }

    // Check rate limit
    const hasLimit = await CustomerService.checkLimit();
    if (!hasLimit) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (!query) {
      return NextResponse.json(
        { error: "Search query required" },
        { status: 400 },
      );
    }

    // Check wallet balance
    const hasFunds = await CustomerService.hasSufficientBalance(userId, SEARCH_COST);
    if (!hasFunds) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 402 },
      );
    }

    // Perform search
    const results = await searchProvider.search({
      query,
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    // Calculate tokens used (estimation)
    const tokensUsed = Math.ceil(query.length / 4) + results.length * 10;
    const tokenCost = tokensUsed * TOKEN_COST;
    const totalCost = SEARCH_COST + tokenCost;

    // Deduct from wallet
    await CustomerService.deductUsage({
      userId,
      operationType: "search",
      cost: totalCost,
      tokensUsed,
      metadata: { query, resultCount: results.length },
    });

    // Get remaining balance
    const wallet = await CustomerService.getOrCreateWallet(userId);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results,
      costDeducted: totalCost,
      remainingBalance: wallet.balance,
      tokensUsed,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 },
    );
  }
}
