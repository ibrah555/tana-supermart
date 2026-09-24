import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "monthly"; // daily, weekly, monthly, custom
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDate = new Date();
    let endDate = new Date();

    if (range === "daily") {
      startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    } else if (range === "weekly") {
      startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "monthly") {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    } else if (range === "custom" && startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
    } else {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    // Query orders within date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: true,
      },
    });

    let grossRevenue = 0;
    let totalCogs = 0;
    let totalLosses = 0;
    let paidOrdersCount = 0;

    const skuVelocityMap: Record<
      string,
      {
        id: string;
        title: string;
        unitsSold: number;
        revenue: number;
        cost: number;
        profit: number;
      }
    > = {};

    for (const o of orders) {
      if (o.status === "CANCELLED") {
        totalLosses += o.total;
        continue;
      }

      grossRevenue += o.total;
      totalCogs += o.cogs;
      paidOrdersCount++;

      for (const item of o.items) {
        const key = item.productId || item.title;
        if (!skuVelocityMap[key]) {
          skuVelocityMap[key] = {
            id: key,
            title: item.title,
            unitsSold: 0,
            revenue: 0,
            cost: 0,
            profit: 0,
          };
        }
        skuVelocityMap[key].unitsSold += item.quantity;
        skuVelocityMap[key].revenue += item.price * item.quantity;
        skuVelocityMap[key].cost += item.costPrice * item.quantity;
        skuVelocityMap[key].profit += (item.price - item.costPrice) * item.quantity;
      }
    }

    const grossProfit = Math.max(0, grossRevenue - totalCogs - totalLosses);
    const profitMargin = grossRevenue > 0 ? (grossProfit / grossRevenue) * 100 : 0;
    const platformCommissions = grossRevenue * 0.08; // Average 8% cut
    const averageOrderValue = paidOrdersCount > 0 ? Math.round(grossRevenue / paidOrdersCount) : 0;

    const productVelocity = Object.values(skuVelocityMap).map((p) => {
      const margin = p.revenue > 0 ? ((p.profit / p.revenue) * 100).toFixed(1) : "0.0";
      return {
        ...p,
        profitMargin: parseFloat(margin),
        velocity: p.unitsSold >= 5 ? "Top Performer" : p.unitsSold >= 2 ? "Moderate" : "Low Movement",
      };
    });

    return NextResponse.json({
      summary: {
        range,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        grossRevenue: Math.round(grossRevenue),
        cogs: Math.round(totalCogs),
        grossProfit: Math.round(grossProfit),
        profitMargin: parseFloat(profitMargin.toFixed(1)),
        losses: Math.round(totalLosses),
        platformCommissions: Math.round(platformCommissions),
        averageOrderValue,
        totalOrders: orders.length,
        paidOrders: paidOrdersCount,
      },
      productVelocity: productVelocity.sort((a, b) => b.unitsSold - a.unitsSold),
    });
  } catch (err: any) {
    console.error("Admin reports API error:", err);
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
