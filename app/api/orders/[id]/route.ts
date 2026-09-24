import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: params.id }, { orderNumber: params.id }],
      },
      include: {
        items: true,
        transactions: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Order GET error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, courierName, trackingNumber, mpesaReceipt } = body;

    const existing = await prisma.order.findFirst({
      where: { OR: [{ id: params.id }, { orderNumber: params.id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (mpesaReceipt) updates.mpesaReceipt = mpesaReceipt;
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (courierName) {
      updates.estimatedDelivery = `Assigned to ${courierName}. Delivery in 24-48 hrs.`;
    }

    const updated = await prisma.order.update({
      where: { id: existing.id },
      data: updates,
      include: { items: true },
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    console.error("Order PATCH error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
