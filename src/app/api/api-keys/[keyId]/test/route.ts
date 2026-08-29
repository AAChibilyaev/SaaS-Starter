import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database";
import { apiKeys } from "@/database/schema";
import { eq, and } from "drizzle-orm";
import { getAuthSessionFromHeaders } from "@/lib/auth/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ keyId: string }> },
) {
  const session = await getAuthSessionFromHeaders(request.headers);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { keyId } = await params;

  const key = await db.query.apiKeys.findFirst({
    where: and(
      eq(apiKeys.id, keyId),
      eq(apiKeys.userId, session.user.id),
    ),
  });

  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }

  if (!key.isActive) {
    return NextResponse.json({ error: "API key is not active" }, { status: 400 });
  }

  if (key.expiresAt && key.expiresAt < new Date()) {
    return NextResponse.json({ error: "API key has expired" }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "API key is valid and working",
    key: {
      name: key.name,
      isActive: key.isActive,
      expiresAt: key.expiresAt?.toISOString() ?? null,
    },
  });
}
