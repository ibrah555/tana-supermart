import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { initiateStkPush } from "@/lib/mpesa";

export async function POST(req: Request) {
  try {
    const { phoneNumber, amount, orderId } = await req.json();

    if (!phoneNumber || !amount || !orderId) {
      return NextResponse.json(
        { error: "phoneNumber, amount, and orderId are required" },
        { status: 400 }
      );
    }

    const stkResult = await initiateStkPush({
      phoneNumber,
      amount: parseFloat(amount),
      orderId,
      accountReference: "TanaSupermart",
      transactionDesc: `Order ${orderId}`,
    });

    if (stkResult.checkoutRequestId) {
      // Save pending M-PESA transaction record in database
      await prisma.mpesaTransaction.upsert({
        where: { checkoutRequestId: stkResult.checkoutRequestId },
        update: {
          orderId,
          amount: parseFloat(amount),
          phoneNumber,
          status: "PENDING",
        },
        create: {
          checkoutRequestId: stkResult.checkoutRequestId,
          merchantRequestId: stkResult.merchantRequestId || `MR_${Date.now()}`,
          orderId,
          amount: parseFloat(amount),
          phoneNumber,
          status: "PENDING",
          resultDesc: stkResult.customerMessage || "STK Push Initiated",
        },
      });
    }

    return NextResponse.json(stkResult);
  } catch (err: any) {
    console.error("M-PESA STK Push API error:", err);
    return NextResponse.json({ error: "Failed to initiate M-PESA STK push" }, { status: 500 });
  }
}
