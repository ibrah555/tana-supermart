import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (err: any) {
    console.error("Product GET by id error:", err);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { stockQuantity, deltaStock, price, costPrice, originalPrice, isFlashSale, inStock } = body;

    const existing = await prisma.product.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const updates: any = {};

    if (stockQuantity !== undefined) {
      const q = Math.max(0, parseInt(stockQuantity, 10));
      updates.stockQuantity = q;
      updates.inStock = q > 0;
    } else if (deltaStock !== undefined) {
      const q = Math.max(0, existing.stockQuantity + parseInt(deltaStock, 10));
      updates.stockQuantity = q;
      updates.inStock = q > 0;
    }

    if (inStock !== undefined && stockQuantity === undefined && deltaStock === undefined) {
      updates.inStock = inStock;
      if (!inStock) {
        updates.stockQuantity = 0;
      } else if (existing.stockQuantity <= 0) {
        updates.stockQuantity = 10;
      }
    }

    if (price !== undefined) updates.price = parseFloat(price);
    if (costPrice !== undefined) updates.costPrice = parseFloat(costPrice);
    if (originalPrice !== undefined) updates.originalPrice = parseFloat(originalPrice);
    if (isFlashSale !== undefined) updates.isFlashSale = isFlashSale;

    const updated = await prisma.product.update({
      where: { id: existing.id },
      data: updates,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    console.error("Product PATCH error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const existing = await prisma.product.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({ where: { id: existing.id } });
    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    console.error("Product DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
