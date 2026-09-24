import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [countyRates, commissions] = await Promise.all([
      prisma.countyShippingRate.findMany({ orderBy: { standardFee: "asc" } }),
      prisma.categoryCommission.findMany({ orderBy: { ratePercent: "desc" } }),
    ]);

    return NextResponse.json({ countyRates, commissions });
  } catch (err: any) {
    console.error("Admin settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { type, id, updates } = body;

    if (type === "countyRate" && id) {
      const updated = await prisma.countyShippingRate.update({
        where: { id },
        data: updates,
      });
      return NextResponse.json({ success: true, updated });
    }

    if (type === "commission" && id) {
      const updated = await prisma.categoryCommission.update({
        where: { id },
        data: updates,
      });
      return NextResponse.json({ success: true, updated });
    }

    return NextResponse.json({ error: "Invalid settings update type" }, { status: 400 });
  } catch (err: any) {
    console.error("Admin settings PATCH error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
