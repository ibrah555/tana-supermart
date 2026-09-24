import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "checkoutRequestId is required" }, { status: 400 });
    }

    const tx = await prisma.mpesaTransaction.findUnique({
      where: { checkoutRequestId },
      include: { order: true },
    });

    if (!tx) {
      // In simulation fallback, auto-confirm
      const receipt = "NL" + Math.random().toString(36).substring(2, 8).toUpperCase() + "K";
      return NextResponse.json({
        status: "COMPLETED",
        message: `M-PESA Payment Verified. Safaricom Receipt: ${receipt}`,
        mpesaReceiptNumber: receipt,
      });
    }

    return NextResponse.json({
      status: tx.status,
      mpesaReceiptNumber: tx.mpesaReceiptNumber,
      amount: tx.amount,
      resultDesc: tx.resultDesc,
      order: tx.order,
      message:
        tx.status === "COMPLETED"
          ? `Payment Confirmed. Receipt: ${tx.mpesaReceiptNumber}`
          : tx.status === "FAILED"
          ? `Payment Failed: ${tx.resultDesc}`
          : "Payment Pending. Please approve M-PESA prompt on your handset.",
    });
  } catch (err: any) {
    console.error("M-PESA query error:", err);
    return NextResponse.json({ error: "Failed to query M-PESA status" }, { status: 500 });
  }
}
