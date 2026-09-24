import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    console.log("📥 Safaricom Daraja Callback received:", JSON.stringify(data));

    const stkCallback = data?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: "Invalid callback payload" });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } =
      stkCallback;

    let mpesaReceiptNumber = null;
    let transactionAmount = 0;
    let phoneNumber = "";

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      for (const item of CallbackMetadata.Item) {
        if (item.Name === "MpesaReceiptNumber") mpesaReceiptNumber = item.Value?.toString();
        if (item.Name === "Amount") transactionAmount = parseFloat(item.Value);
        if (item.Name === "PhoneNumber") phoneNumber = item.Value?.toString();
      }
    }

    const isSuccess = ResultCode === 0;

    // Update MpesaTransaction in database
    const transaction = await prisma.mpesaTransaction.upsert({
      where: { checkoutRequestId: CheckoutRequestID },
      update: {
        status: isSuccess ? "COMPLETED" : "FAILED",
        mpesaReceiptNumber: mpesaReceiptNumber,
        resultDesc: ResultDesc,
        rawCallbackData: JSON.stringify(data),
      },
      create: {
        checkoutRequestId: CheckoutRequestID,
        merchantRequestId: MerchantRequestID,
        status: isSuccess ? "COMPLETED" : "FAILED",
        mpesaReceiptNumber: mpesaReceiptNumber,
        resultDesc: ResultDesc,
        amount: transactionAmount,
        phoneNumber: phoneNumber,
        rawCallbackData: JSON.stringify(data),
      },
    });

    // If payment succeeded and is linked to an order, update Order status to PAID
    if (isSuccess && transaction.orderId) {
      await prisma.order.update({
        where: { id: transaction.orderId },
        data: {
          status: "PAID",
          mpesaReceipt: mpesaReceiptNumber,
        },
      });
    }

    // Acknowledge receipt to Safaricom
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Callback accepted successfully" });
  } catch (err: any) {
    console.error("Daraja callback handler error:", err);
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Internal server error processing callback" });
  }
}
