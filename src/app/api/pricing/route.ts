import { NextResponse } from "next/server";
import { db } from "@/database";
import { tariffs } from "@/database/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const activeTariffs = await db
      .select()
      .from(tariffs)
      .where(eq(tariffs.isActive, true))
      .orderBy(tariffs.displayOrder);

    // Transform database records to API response
    const formattedTariffs = activeTariffs.map((tariff) => ({
      id: tariff.id,
      slug: tariff.slug,
      name: tariff.name,
      description: tariff.description,
      priceMonthly: parseFloat(tariff.priceMonthly),
      priceYearly: tariff.priceYearly ? parseFloat(tariff.priceYearly) : null,
      features: tariff.features as string[],
      displayOrder: tariff.displayOrder,
    }));

    return NextResponse.json(formattedTariffs);
  } catch (error) {
    console.error("Failed to fetch pricing:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newTariff = await db
      .insert(tariffs)
      .values({
        slug: body.slug,
        name: body.name,
        description: body.description,
        priceMonthly: body.priceMonthly.toString(),
        priceYearly: body.priceYearly?.toString(),
        features: body.features || [],
        displayOrder: body.displayOrder || 0,
      })
      .returning();

    return NextResponse.json(newTariff[0], { status: 201 });
  } catch (error) {
    console.error("Failed to create pricing:", error);
    return NextResponse.json(
      { error: "Failed to create pricing" },
      { status: 500 },
    );
  }
}
