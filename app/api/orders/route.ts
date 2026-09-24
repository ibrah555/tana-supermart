import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerPhone: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { mpesaReceipt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          items: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err: any) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      customerName,
      customerEmail,
      customerPhone,
      county,
      addressLine,
      items,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod,
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Customer details and order items are required" },
        { status: 400 }
      );
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TS-${new Date().getFullYear()}-${randomSuffix}`;

    // Calculate total wholesale cost (COGS) and decrement product inventory
    let totalCogs = 0;
    const orderItemsData = [];

    for (const item of items) {
      let costPrice = item.costPrice || item.price * 0.7;

      if (item.productId) {
        const prod = await prisma.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          costPrice = prod.costPrice;
          const newQty = Math.max(0, prod.stockQuantity - item.quantity);
          await prisma.product.update({
            where: { id: prod.id },
            data: {
              stockQuantity: newQty,
              inStock: newQty > 0,
              soldCount: { increment: item.quantity },
            },
          });
        }
      }

      totalCogs += costPrice * item.quantity;
      orderItemsData.push({
        productId: item.productId || null,
        title: item.title,
        price: parseFloat(item.price),
        costPrice: parseFloat(costPrice),
        quantity: parseInt(item.quantity, 10),
        image: item.image || "",
      });
    }

    const orderSubtotal = parseFloat(subtotal);
    const orderDelivery = parseFloat(deliveryFee || 0);
    const orderDiscount = parseFloat(discount || 0);
    const orderTotal = parseFloat(total || orderSubtotal + orderDelivery - orderDiscount);
    const orderProfit = Math.max(0, orderSubtotal - totalCogs);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        customerName,
        customerEmail: customerEmail || "",
        customerPhone,
        status: "PENDING_PAYMENT",
        subtotal: orderSubtotal,
        deliveryFee: orderDelivery,
        discount: orderDiscount,
        total: orderTotal,
        cogs: totalCogs,
        profit: orderProfit,
        county: county || "Nairobi",
        addressLine: addressLine || "Nairobi, Kenya",
        paymentMethod: paymentMethod || "MPESA",
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: true,
      },
    });

    // Update user stats if registered
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          ordersCount: { increment: 1 },
          totalSpent: { increment: orderTotal },
        },
      });
    }

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    console.error("Order POST error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
