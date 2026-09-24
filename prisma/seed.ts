import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultAdminCredentials, defaultCountyShippingRates, defaultCategoryCommissions } from "../data/adminPresets";
import { products } from "../data/products";
import { categories } from "../data/categories";
import { stores } from "../data/stores";
import { sampleUsers, initialVouchers, sampleOrders } from "../data/user";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Tana Supermart Database Seed...");

  // 1. Seed Categories
  console.log("Seeding categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.slug,
        image: cat.image || "",
        productCount: cat.productCount || 0,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.slug,
        image: cat.image || "",
        productCount: cat.productCount || 0,
      },
    });
  }

  // 2. Seed Stores
  console.log("Seeding stores...");
  for (const store of stores) {
    await prisma.store.upsert({
      where: { slug: store.id },
      update: {
        name: store.name,
        rating: store.score,
        positiveFeedback: 98,
        isVerified: true,
      },
      create: {
        id: store.id,
        name: store.name,
        slug: store.id,
        rating: store.score,
        positiveFeedback: 98,
        isVerified: true,
        status: "Active",
        commissionRate: 8.0,
      },
    });
  }

  // 3. Seed Users (including Super Admin)
  console.log("Seeding users & default super admin...");
  const rawAdminPass = defaultAdminCredentials.passwordHash || "Admin@2026!";
  const hashedPassword = await bcrypt.hash(rawAdminPass, 10);
  
  // Master Admin
  await prisma.user.upsert({
    where: { email: defaultAdminCredentials.email },
    update: {
      name: defaultAdminCredentials.name,
      role: defaultAdminCredentials.role,
      passwordHash: hashedPassword,
      status: "Active",
    },
    create: {
      name: defaultAdminCredentials.name,
      email: defaultAdminCredentials.email,
      phone: "+254700000001",
      passwordHash: hashedPassword,
      role: defaultAdminCredentials.role,
      status: "Active",
    },
  });

  // Seed sample users with RBAC roles
  for (const u of sampleUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        status: u.status,
        phone: u.phone,
        totalSpent: u.totalSpent || 0,
        ordersCount: u.ordersCount || 0,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        totalSpent: u.totalSpent || 0,
        ordersCount: u.ordersCount || 0,
        passwordHash: hashedPassword,
      },
    });
  }

  // 4. Seed Products with Stock & Cost Price
  console.log("Seeding products...");
  for (const prod of products) {
    const imagesList = prod.images && prod.images.length > 0 ? prod.images : prod.image ? [prod.image] : [];
    await prisma.product.upsert({
      where: { slug: prod.id },
      update: {
        title: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        costPrice: prod.costPrice || prod.price * 0.7,
        stockQuantity: prod.stockQuantity ?? 50,
        lowStockThreshold: prod.lowStockThreshold ?? 10,
        inStock: prod.inStock,
        rating: prod.rating,
        reviewsCount: prod.reviews || 0,
        soldCount: prod.sold || 0,
        isFlashSale: prod.isFlashSale ?? false,
        flashSaleEndsAt: prod.flashSaleEndsAt ? new Date(prod.flashSaleEndsAt) : null,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        storeId: prod.storeId,
        images: imagesList,
        tags: prod.tags || [],
        shortDescription: prod.description || "",
        fullDescription: prod.description || "",
      },
      create: {
        id: prod.id,
        title: prod.name,
        slug: prod.id,
        price: prod.price,
        originalPrice: prod.originalPrice,
        costPrice: prod.costPrice || prod.price * 0.7,
        stockQuantity: prod.stockQuantity ?? 50,
        lowStockThreshold: prod.lowStockThreshold ?? 10,
        inStock: prod.inStock,
        rating: prod.rating,
        reviewsCount: prod.reviews || 0,
        soldCount: prod.sold || 0,
        isFlashSale: prod.isFlashSale ?? false,
        flashSaleEndsAt: prod.flashSaleEndsAt ? new Date(prod.flashSaleEndsAt) : null,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        storeId: prod.storeId,
        images: imagesList,
        tags: prod.tags || [],
        shortDescription: prod.description || "",
        fullDescription: prod.description || "",
      },
    });
  }

  // 5. Seed County Delivery Rates
  console.log("Seeding Kenya county shipping rates...");
  for (const rate of defaultCountyShippingRates) {
    await prisma.countyShippingRate.upsert({
      where: { countyName: rate.county },
      update: {
        capitalTown: rate.county.split("(")[0].trim(),
        region: rate.region,
        standardFee: rate.fee,
        expressFee: rate.fee + 150,
        estimatedDays: rate.deliveryDays,
        isActive: rate.active,
      },
      create: {
        id: rate.id,
        countyName: rate.county,
        capitalTown: rate.county.split("(")[0].trim(),
        region: rate.region,
        standardFee: rate.fee,
        expressFee: rate.fee + 150,
        estimatedDays: rate.deliveryDays,
        isActive: rate.active,
      },
    });
  }

  // 6. Seed Category Commissions
  console.log("Seeding category commissions...");
  for (const comm of defaultCategoryCommissions) {
    const slug = comm.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    await prisma.categoryCommission.upsert({
      where: { categorySlug: slug },
      update: {
        categoryName: comm.categoryName,
        ratePercent: comm.ratePercent,
        minimumFee: 50.0,
      },
      create: {
        id: comm.id,
        categorySlug: slug,
        categoryName: comm.categoryName,
        ratePercent: comm.ratePercent,
        minimumFee: 50.0,
      },
    });
  }

  // 7. Seed Vouchers
  console.log("Seeding promotional vouchers...");
  for (const v of initialVouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: {
        discountType: v.discountType,
        discountValue: v.discountValue,
        minSpend: v.minSpend,
        expiresAt: new Date(v.expiresAt),
        usageLimit: 500,
        usedCount: v.usedCount || 0,
        isActive: v.isActive,
      },
      create: {
        id: v.id,
        code: v.code,
        discountType: v.discountType,
        discountValue: v.discountValue,
        minSpend: v.minSpend,
        expiresAt: new Date(v.expiresAt),
        usageLimit: 500,
        usedCount: v.usedCount || 0,
        isActive: v.isActive,
      },
    });
  }

  // 8. Seed Initial Sample Orders
  console.log("Seeding sample orders...");
  for (const order of sampleOrders) {
    const existingOrder = await prisma.order.findUnique({ where: { orderNumber: order.orderNumber } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          id: order.id,
          orderNumber: order.orderNumber,
          userId: order.userId,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          status: order.status,
          subtotal: order.subtotal,
          deliveryFee: order.deliveryFee,
          discount: order.discount,
          total: order.total,
          cogs: order.cogs || order.subtotal * 0.7,
          profit: order.profit || order.subtotal * 0.3,
          county: order.county,
          addressLine: order.addressLine,
          paymentMethod: order.paymentMethod,
          mpesaReceipt: order.mpesaReceipt,
          trackingNumber: order.trackingNumber,
          estimatedDelivery: order.estimatedDelivery,
          createdAt: new Date(order.createdAt),
          items: {
            create: order.items.map((item) => ({
              id: item.id,
              productId: item.productId,
              title: item.title,
              price: item.price,
              costPrice: item.costPrice || item.price * 0.7,
              quantity: item.quantity,
              image: item.image,
            })),
          },
        },
      });
    }
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
