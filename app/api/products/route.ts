import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subCategory = searchParams.get("subCategory");
    const search = searchParams.get("search");
    const flashSale = searchParams.get("flashSale");
    const inStock = searchParams.get("inStock");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "24", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== "featured" && category !== "all") {
      where.categorySlug = category;
    }

    if (subCategory) {
      where.subCategorySlug = subCategory;
    }

    if (flashSale === "true") {
      where.isFlashSale = true;
    }

    if (inStock === "true") {
      where.inStock = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (err: any) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      price,
      costPrice,
      stockQuantity,
      categorySlug,
      subCategorySlug,
      storeId,
      image,
      images,
      description,
      isFlashSale,
    } = body;

    if (!title || price === undefined || !categorySlug) {
      return NextResponse.json(
        { error: "Title, price, and categorySlug are required" },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .slice(0, 50) +
        "-" +
        Date.now().toString(36);

    const safeQty = stockQuantity !== undefined ? parseInt(stockQuantity, 10) : 50;
    const imgList = images && images.length > 0 ? images : image ? [image] : [];

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        price: parseFloat(price),
        costPrice: costPrice !== undefined ? parseFloat(costPrice) : parseFloat(price) * 0.7,
        stockQuantity: safeQty,
        lowStockThreshold: body.lowStockThreshold || 10,
        inStock: safeQty > 0,
        categorySlug,
        subCategorySlug: subCategorySlug || null,
        storeId: storeId || "tana-direct",
        images: imgList,
        tags: [categorySlug, storeId || "tana-direct"],
        shortDescription: description || "",
        fullDescription: description || "",
        isFlashSale: isFlashSale || false,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: any) {
    console.error("Product POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
