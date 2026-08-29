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

    const wallet = await CustomerService.getOrCreateWallet(userId);
    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Wallet error:", error);
    return NextResponse.json({ error: "Failed to fetch wallet" }, { status: 500 });
  }
}
