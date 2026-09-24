const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

// Load .env
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const k = trimmed.slice(0, idx).trim();
        let v = trimmed.slice(idx + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        process.env[k] = v;
      }
    }
  }
}

const prisma = new PrismaClient();

const defaultCountyShippingRates = [
  { id: "1", county: "Nairobi (Central CBD)", region: "Nairobi", fee: 150, deliveryDays: "Same Day / 24h", active: true },
  { id: "2", county: "Nairobi (Suburbs & Estates)", region: "Nairobi", fee: 200, deliveryDays: "24 Hours", active: true },
  { id: "3", county: "Kiambu (Thika, Ruiru, Kikuyu)", region: "Central", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "4", county: "Machakos (Athi River, Syokimau)", region: "Eastern", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "5", county: "Kajiado (Kitengela, Ngong, Rongai)", region: "Rift Valley", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "6", county: "Mombasa (Island, Nyali, Bamburi)", region: "Coast", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "7", county: "Kilifi (Mtwapa, Malindi)", region: "Coast", fee: 380, deliveryDays: "2-3 Days", active: true },
  { id: "8", county: "Nakuru (City, Naivasha)", region: "Rift Valley", fee: 300, deliveryDays: "1-2 Days", active: true },
  { id: "9", county: "Uasin Gishu (Eldoret)", region: "Rift Valley", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "10", county: "Kisumu (City, Milimani)", region: "Nyanza", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "11", county: "Kakamega", region: "Western", fee: 380, deliveryDays: "2-3 Days", active: true },
  { id: "12", county: "Nyeri & Central Highlands", region: "Central", fee: 320, deliveryDays: "1-2 Days", active: true },
  { id: "13", county: "Meru & Embu", region: "Eastern", fee: 350, deliveryDays: "2-3 Days", active: true },
  { id: "14", county: "Garissa & North Eastern", region: "North Eastern", fee: 500, deliveryDays: "3-4 Days", active: true },
  { id: "15", county: "All Other 33 Kenya Counties", region: "Nationwide", fee: 400, deliveryDays: "2-4 Days", active: true },
];

const defaultCategoryCommissions = [
  { id: "1", categoryName: "Electronics & Tech", ratePercent: 6.0 },
  { id: "2", categoryName: "Smartphones & Tablets", ratePercent: 5.5 },
  { id: "3", categoryName: "Fashion, Shoes & Bags", ratePercent: 12.0 },
  { id: "4", categoryName: "Supermarket & Groceries", ratePercent: 4.5 },
  { id: "5", categoryName: "Home, Furniture & Appliances", ratePercent: 8.0 },
  { id: "6", categoryName: "Health, Beauty & Hair", ratePercent: 10.0 },
  { id: "7", categoryName: "Automotive & Accessories", ratePercent: 8.5 },
];

const initialVouchers = [
  { id: "v1", code: "WELCOME2026", discountType: "PERCENTAGE", discountValue: 15, minSpend: 1500, expiresAt: "2026-12-31T23:59:59Z", isActive: true },
  { id: "v2", code: "FLASHKES500", discountType: "FIXED", discountValue: 500, minSpend: 3000, expiresAt: "2026-10-31T23:59:59Z", isActive: true },
  { id: "v3", code: "FREEDELIVERY", discountType: "FIXED", discountValue: 200, minSpend: 2500, expiresAt: "2026-11-30T23:59:59Z", isActive: true },
];

const sampleUsersList = [
  { id: "u01", name: "Ibrahim (Master Admin)", email: "admin@tanasupermart.co.ke", phone: "+254 712 345 678", role: "SUPER_ADMIN", status: "Active", totalSpent: 0, ordersCount: 0 },
  { id: "u02", name: "Wanjiku Kamau", email: "wanjiku@tanasupermart.co.ke", phone: "+254 722 111 222", role: "OPERATIONS", status: "Active", totalSpent: 0, ordersCount: 0 },
  { id: "u03", name: "Kevin Kiprop", email: "kiprop@tanasupermart.co.ke", phone: "+254 733 444 555", role: "FINANCE", status: "Active", totalSpent: 0, ordersCount: 0 },
  { id: "u04", name: "Amina Hassan (UPHUI Seller)", email: "uphui@seller.tanasupermart.co.ke", phone: "+254 710 999 888", role: "VENDOR", status: "Active", totalSpent: 0, ordersCount: 0 },
  { id: "u05", name: "John Mwangi", email: "mwangi.john@gmail.com", phone: "+254 721 333 444", role: "CUSTOMER", status: "Active", totalSpent: 45890, ordersCount: 7 },
  { id: "u06", name: "Fatuma Ali", email: "fatuma.ali@yahoo.com", phone: "+254 734 555 666", role: "CUSTOMER", status: "Active", totalSpent: 12400, ordersCount: 2 },
  { id: "u07", name: "Brian Otieno", email: "brian.otieno@outlook.com", phone: "+254 799 777 888", role: "CUSTOMER", status: "Active", totalSpent: 78500, ordersCount: 11 },
  { id: "u08", name: "Mercy Chebet", email: "mercy.chebet@gmail.com", phone: "+254 701 222 333", role: "CUSTOMER", status: "Active", totalSpent: 3200, ordersCount: 1 },
  { id: "u09", name: "Dennis Mutua", email: "dennis.mutua@gmail.com", phone: "+254 715 666 777", role: "CUSTOMER", status: "Flagged", totalSpent: 89000, ordersCount: 4 },
  { id: "u10", name: "Grace Nduta", email: "grace.nduta@gmail.com", phone: "+254 728 888 999", role: "CUSTOMER", status: "Active", totalSpent: 19800, ordersCount: 3 },
];

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

const productsList = [
  { id: "p01", name: "Men Watches Fashion Sport Stainless Steel Case Steel Band Quartz Analog Wrist Watch", categorySlug: "watches-jewellery", subCategorySlug: "mens-watches", storeId: "uphui", price: 99, originalPrice: 2499, costPrice: 45, stockQuantity: 42, lowStockThreshold: 10, image: img("photo-1523275335684-37898b6baf30"), rating: 4.7, reviews: 2580, sold: 12800, inStock: true, isFlashSale: true },
  { id: "p02", name: "Wireless Bluetooth 5.3 Earbuds Noise Cancelling Gaming Headphones", categorySlug: "tv-audio-video", subCategorySlug: "home-audio", storeId: "tana-direct", price: 1299, originalPrice: 3500, costPrice: 650, stockQuantity: 5, lowStockThreshold: 10, image: img("photo-1590658268037-6bf12165a8df"), rating: 4.8, reviews: 1420, sold: 5400, inStock: true, isFlashSale: true },
  { id: "p03", name: "Casual Slim Fit Breathable Short Sleeve Summer Polo T-Shirt", categorySlug: "fashion", subCategorySlug: "mens-clothing", storeId: "uphui", price: 650, originalPrice: 1500, costPrice: 280, stockQuantity: 88, lowStockThreshold: 15, image: img("photo-1521572267360-ee0c2909d518"), rating: 4.5, reviews: 890, sold: 3200, inStock: true, isFlashSale: true },
  { id: "p04", name: "Smart Fitness Watch IP68 Waterproof Blood Pressure Heart Rate Monitor", categorySlug: "smartphones", subCategorySlug: "smart-watches", storeId: "tana-direct", price: 2199, originalPrice: 4800, costPrice: 1100, stockQuantity: 24, lowStockThreshold: 10, image: img("photo-1508685096489-7aacd43bd3b1"), rating: 4.6, reviews: 3100, sold: 8900, inStock: true, isFlashSale: true },
  { id: "p05", name: "High Speed USB 3.0 Flash Drive 64GB Metal Waterproof Pen Drive", categorySlug: "computers", subCategorySlug: "storage", storeId: "joyous-household", price: 499, originalPrice: 1200, costPrice: 210, stockQuantity: 3, lowStockThreshold: 10, image: img("photo-1618424181497-157f25b6ddd5"), rating: 4.9, reviews: 450, sold: 1600, inStock: true, isFlashSale: false },
  { id: "p06", name: "Men Breathable Mesh Running Shoes Non-Slip Athletic Sneakers", categorySlug: "shoes", subCategorySlug: "mens-shoes", storeId: "uphui", price: 1850, originalPrice: 3800, costPrice: 920, stockQuantity: 65, lowStockThreshold: 15, image: img("photo-1542291026-7eec264c27ff"), rating: 4.4, reviews: 980, sold: 4100, inStock: true, isFlashSale: false },
  { id: "p07", name: "Professional Hair Clipper Rechargeable Cordless Beard Trimmer", categorySlug: "health-beauty", subCategorySlug: "personal-care", storeId: "joyous-household", price: 1150, originalPrice: 2600, costPrice: 530, stockQuantity: 31, lowStockThreshold: 10, image: img("photo-1621607512214-68297480165e"), rating: 4.6, reviews: 670, sold: 2900, inStock: true, isFlashSale: false },
  { id: "p08", name: "10000mAh Ultra Slim Power Bank Fast Charging Dual USB Output", categorySlug: "smartphones", subCategorySlug: "phone-accessories", storeId: "tana-direct", price: 1450, originalPrice: 2800, costPrice: 720, stockQuantity: 47, lowStockThreshold: 10, image: img("photo-1609592426868-b789791ce5c9"), rating: 4.7, reviews: 1890, sold: 6700, inStock: true, isFlashSale: false },
  { id: "p09", name: "Multifunctional Electric Cooker Non-Stick Hot Pot Mini Rice Cooker", categorySlug: "home-appliances", subCategorySlug: "small-appliances", storeId: "joyous-household", price: 2350, originalPrice: 4500, costPrice: 1250, stockQuantity: 7, lowStockThreshold: 10, image: img("photo-1584269600519-112d071b35e6"), rating: 4.5, reviews: 520, sold: 1800, inStock: true, isFlashSale: false },
  { id: "p10", name: "Full HD 1080P Car Dash Cam Night Vision 170 Wide Angle Recorder", categorySlug: "automotive", subCategorySlug: "car-electronics", storeId: "tana-direct", price: 2800, originalPrice: 5500, costPrice: 1400, stockQuantity: 19, lowStockThreshold: 8, image: img("photo-1549399542-7e3f8b79c341"), rating: 4.3, reviews: 340, sold: 1100, inStock: true, isFlashSale: false },
  { id: "p11", name: "Leather Crossbody Shoulder Bag Vintage Messenger Bag for Women", categorySlug: "fashion", subCategorySlug: "bags", storeId: "uphui", price: 1250, originalPrice: 2900, costPrice: 580, stockQuantity: 52, lowStockThreshold: 12, image: img("photo-1548036328-c9fa89d128fa"), rating: 4.8, reviews: 1120, sold: 3800, inStock: true, isFlashSale: false },
  { id: "p12", name: "Mechanical Gaming Keyboard RGB Backlit Blue Switches 87 Keys", categorySlug: "computers", subCategorySlug: "keyboards-mice", storeId: "tana-direct", price: 3200, originalPrice: 6200, costPrice: 1650, stockQuantity: 28, lowStockThreshold: 10, image: img("photo-1587829741301-dc798b83add3"), rating: 4.7, reviews: 780, sold: 2400, inStock: true, isFlashSale: false },
  { id: "p13", name: "Pure Organic Argan Oil for Hair and Skin Hydration Treatment", categorySlug: "health-beauty", subCategorySlug: "hair-care", storeId: "joyous-household", price: 850, originalPrice: 1800, costPrice: 380, stockQuantity: 74, lowStockThreshold: 15, image: img("photo-1608248597359-59754f9a03b5"), rating: 4.9, reviews: 2150, sold: 7300, inStock: true, isFlashSale: false },
  { id: "p14", name: "LED Desk Lamp with Wireless Charger Eye-Caring Reading Light", categorySlug: "home-appliances", subCategorySlug: "lighting", storeId: "joyous-household", price: 1950, originalPrice: 3800, costPrice: 950, stockQuantity: 9, lowStockThreshold: 10, image: img("photo-1507473885765-e6ed057f782c"), rating: 4.6, reviews: 410, sold: 1500, inStock: true, isFlashSale: false },
  { id: "p15", name: "Baby Carrier Ergonomic 360 Kangaroo Wrap Hipseat Soft Sling", categorySlug: "baby-products", subCategorySlug: "baby-gear", storeId: "uphui", price: 2600, originalPrice: 5200, costPrice: 1300, stockQuantity: 36, lowStockThreshold: 10, image: img("photo-1519689680058-324335c77eba"), rating: 4.8, reviews: 630, sold: 2100, inStock: true, isFlashSale: false },
  { id: "p16", name: "Stainless Steel Vacuum Insulated Water Bottle 500ml Flask", categorySlug: "supermarket", subCategorySlug: "kitchenware", storeId: "joyous-household", price: 750, originalPrice: 1600, costPrice: 350, stockQuantity: 0, lowStockThreshold: 10, image: img("photo-1602143407151-7111542de6e8"), rating: 4.6, reviews: 890, sold: 3400, inStock: false, isFlashSale: false },
];

const sampleOrdersList = [
  { id: "ord-1", orderNumber: "TS-2026-8941", userId: "u05", customerName: "John Mwangi", customerEmail: "mwangi.john@gmail.com", customerPhone: "+254 721 333 444", status: "DELIVERED", subtotal: 4299, deliveryFee: 200, discount: 500, total: 3999, cogs: 2150, profit: 1849, county: "Nairobi (Suburbs & Estates)", addressLine: "Apartment 4B, Kilimani Ring Road", paymentMethod: "MPESA", mpesaReceipt: "NL892X019K", trackingNumber: "SND-7821-KE", estimatedDelivery: "Delivered on Sep 18, 2026", createdAt: "2026-09-18T10:30:00Z" },
  { id: "ord-2", orderNumber: "TS-2026-8942", userId: "u06", customerName: "Fatuma Ali", customerEmail: "fatuma.ali@yahoo.com", customerPhone: "+254 734 555 666", status: "PROCESSING", subtotal: 2199, deliveryFee: 350, discount: 0, total: 2549, cogs: 1100, profit: 1099, county: "Mombasa (Island, Nyali, Bamburi)", addressLine: "Nyali Links Road, Near City Mall", paymentMethod: "MPESA", mpesaReceipt: "NL894B771M", trackingNumber: "FARGO-4412", estimatedDelivery: "In Transit with Fargo Courier", createdAt: "2026-09-20T14:15:00Z" },
  { id: "ord-3", orderNumber: "TS-2026-8943", userId: "u07", customerName: "Brian Otieno", customerEmail: "brian.otieno@outlook.com", customerPhone: "+254 799 777 888", status: "PAID", subtotal: 6498, deliveryFee: 350, discount: 500, total: 6348, cogs: 3200, profit: 2798, county: "Kisumu (City, Milimani)", addressLine: "Milimani Estate, Block C", paymentMethod: "MPESA", mpesaReceipt: "NL897K419Z", trackingNumber: null, estimatedDelivery: "Awaiting Courier Dispatch", createdAt: "2026-09-22T08:45:00Z" },
  { id: "ord-4", orderNumber: "TS-2026-8944", userId: "u08", customerName: "Mercy Chebet", customerEmail: "mercy.chebet@gmail.com", customerPhone: "+254 701 222 333", status: "PENDING_PAYMENT", subtotal: 3200, deliveryFee: 350, discount: 0, total: 3550, cogs: 1650, profit: 1550, county: "Uasin Gishu (Eldoret)", addressLine: "Elgon View, House 12", paymentMethod: "MPESA", mpesaReceipt: null, trackingNumber: null, estimatedDelivery: null, createdAt: "2026-09-23T06:00:00Z" },
  { id: "ord-5", orderNumber: "TS-2026-8945", userId: "u10", customerName: "Grace Nduta", customerEmail: "grace.nduta@gmail.com", customerPhone: "+254 728 888 999", status: "SHIPPED", subtotal: 1950, deliveryFee: 250, discount: 200, total: 2000, cogs: 950, profit: 800, county: "Kiambu (Thika, Ruiru, Kikuyu)", addressLine: "Membley Estate, Court 5", paymentMethod: "MPESA", mpesaReceipt: "NL901P552X", trackingNumber: "SND-8890-KE", estimatedDelivery: "Out for Delivery today", createdAt: "2026-09-21T16:20:00Z" },
  { id: "ord-6", orderNumber: "TS-2026-8946", userId: "u05", customerName: "John Mwangi", customerEmail: "mwangi.john@gmail.com", customerPhone: "+254 721 333 444", status: "DELIVERED", subtotal: 1850, deliveryFee: 150, discount: 0, total: 2000, cogs: 920, profit: 930, county: "Nairobi (Central CBD)", addressLine: "Kenyatta Ave, Jubilee Exchange 3rd Fl", paymentMethod: "MPESA", mpesaReceipt: "NL905M112A", trackingNumber: "SND-9102-KE", estimatedDelivery: "Delivered on Sep 15, 2026", createdAt: "2026-09-15T11:00:00Z" },
  { id: "ord-7", orderNumber: "TS-2026-8947", userId: "u07", customerName: "Brian Otieno", customerEmail: "brian.otieno@outlook.com", customerPhone: "+254 799 777 888", status: "DELIVERED", subtotal: 8400, deliveryFee: 300, discount: 500, total: 8200, cogs: 4200, profit: 3700, county: "Nakuru (City, Naivasha)", addressLine: "Section 58, Near Hyrax Hill", paymentMethod: "MPESA", mpesaReceipt: "NL910W884Q", trackingNumber: "FARGO-5519", estimatedDelivery: "Delivered on Sep 12, 2026", createdAt: "2026-09-12T09:15:00Z" },
  { id: "ord-8", orderNumber: "TS-2026-8948", userId: "u06", customerName: "Fatuma Ali", customerEmail: "fatuma.ali@yahoo.com", customerPhone: "+254 734 555 666", status: "CANCELLED", subtotal: 499, deliveryFee: 350, discount: 0, total: 849, cogs: 210, profit: 0, county: "Mombasa (Island, Nyali, Bamburi)", addressLine: "Digo Road, Old Town", paymentMethod: "MPESA", mpesaReceipt: null, trackingNumber: null, estimatedDelivery: "Cancelled by Customer", createdAt: "2026-09-19T13:40:00Z" },
  { id: "ord-9", orderNumber: "TS-2026-8949", userId: "u09", customerName: "Dennis Mutua", customerEmail: "dennis.mutua@gmail.com", customerPhone: "+254 715 666 777", status: "PROCESSING", subtotal: 12500, deliveryFee: 250, discount: 500, total: 12250, cogs: 6200, profit: 5550, county: "Machakos (Athi River, Syokimau)", addressLine: "Greatwall Gardens Phase 2", paymentMethod: "MPESA", mpesaReceipt: "NL918T990L", trackingNumber: "G4S-19401", estimatedDelivery: "Handed over to G4S Courier", createdAt: "2026-09-22T17:10:00Z" },
  { id: "ord-10", orderNumber: "TS-2026-8950", userId: "u10", customerName: "Grace Nduta", customerEmail: "grace.nduta@gmail.com", customerPhone: "+254 728 888 999", status: "DELIVERED", subtotal: 2600, deliveryFee: 250, discount: 0, total: 2850, cogs: 1300, profit: 1300, county: "Kiambu (Thika, Ruiru, Kikuyu)", addressLine: "Thika Greens Estate, Phase 1", paymentMethod: "MPESA", mpesaReceipt: "NL922R441P", trackingNumber: "SND-9340-KE", estimatedDelivery: "Delivered on Sep 17, 2026", createdAt: "2026-09-17T08:00:00Z" },
  { id: "ord-11", orderNumber: "TS-2026-8951", userId: "u05", customerName: "John Mwangi", customerEmail: "mwangi.john@gmail.com", customerPhone: "+254 721 333 444", status: "DELIVERED", subtotal: 99, deliveryFee: 150, discount: 0, total: 249, cogs: 45, profit: 54, county: "Nairobi (Central CBD)", addressLine: "Moi Avenue, Savelberg Building", paymentMethod: "MPESA", mpesaReceipt: "NL925X771K", trackingNumber: "SND-9411-KE", estimatedDelivery: "Delivered on Sep 10, 2026", createdAt: "2026-09-10T15:20:00Z" },
  { id: "ord-12", orderNumber: "TS-2026-8952", userId: "u07", customerName: "Brian Otieno", customerEmail: "brian.otieno@outlook.com", customerPhone: "+254 799 777 888", status: "PAID", subtotal: 5198, deliveryFee: 350, discount: 500, total: 5048, cogs: 2550, profit: 2148, county: "Kisumu (City, Milimani)", addressLine: "Tom Mboya Estate, Lane 4", paymentMethod: "MPESA", mpesaReceipt: "NL930M332W", trackingNumber: null, estimatedDelivery: "Processing in Warehouse", createdAt: "2026-09-23T07:15:00Z" },
];

async function main() {
  console.log("🌱 Starting Pure JavaScript Database Seed...");

  // 1. Seed Users
  console.log("Seeding users & admin...");
  const hashedPassword = await bcrypt.hash("Admin@2026!", 10);
  for (const u of sampleUsersList) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        status: u.status,
        phone: u.phone,
        totalSpent: u.totalSpent,
        ordersCount: u.ordersCount,
      },
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        totalSpent: u.totalSpent,
        ordersCount: u.ordersCount,
        passwordHash: hashedPassword,
      },
    });
  }

  // 2. Seed Products
  console.log("Seeding products...");
  for (const prod of productsList) {
    await prisma.product.upsert({
      where: { slug: prod.id },
      update: {
        title: prod.name,
        price: prod.price,
        originalPrice: prod.originalPrice,
        costPrice: prod.costPrice,
        stockQuantity: prod.stockQuantity,
        lowStockThreshold: prod.lowStockThreshold,
        inStock: prod.inStock,
        rating: prod.rating,
        reviewsCount: prod.reviews,
        soldCount: prod.sold,
        isFlashSale: prod.isFlashSale,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        storeId: prod.storeId,
        images: [prod.image],
        tags: [prod.categorySlug, prod.storeId],
        shortDescription: prod.name,
        fullDescription: prod.name,
      },
      create: {
        id: prod.id,
        title: prod.name,
        slug: prod.id,
        price: prod.price,
        originalPrice: prod.originalPrice,
        costPrice: prod.costPrice,
        stockQuantity: prod.stockQuantity,
        lowStockThreshold: prod.lowStockThreshold,
        inStock: prod.inStock,
        rating: prod.rating,
        reviewsCount: prod.reviews,
        soldCount: prod.sold,
        isFlashSale: prod.isFlashSale,
        categorySlug: prod.categorySlug,
        subCategorySlug: prod.subCategorySlug,
        storeId: prod.storeId,
        images: [prod.image],
        tags: [prod.categorySlug, prod.storeId],
        shortDescription: prod.name,
        fullDescription: prod.name,
      },
    });
  }

  // 3. Seed County Rates
  console.log("Seeding county shipping rates...");
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

  // 4. Seed Category Commissions
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

  // 5. Seed Vouchers
  console.log("Seeding vouchers...");
  for (const v of initialVouchers) {
    await prisma.voucher.upsert({
      where: { code: v.code },
      update: {
        discountType: v.discountType,
        discountValue: v.discountValue,
        minSpend: v.minSpend,
        expiresAt: new Date(v.expiresAt),
        usageLimit: 500,
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
        isActive: v.isActive,
      },
    });
  }

  // 6. Seed Sample Orders
  console.log("Seeding sample orders...");
  for (const o of sampleOrdersList) {
    const existing = await prisma.order.findUnique({ where: { orderNumber: o.orderNumber } });
    if (!existing) {
      await prisma.order.create({
        data: {
          id: o.id,
          orderNumber: o.orderNumber,
          userId: o.userId,
          customerName: o.customerName,
          customerEmail: o.customerEmail,
          customerPhone: o.customerPhone,
          status: o.status,
          subtotal: o.subtotal,
          deliveryFee: o.deliveryFee,
          discount: o.discount,
          total: o.total,
          cogs: o.cogs,
          profit: o.profit,
          county: o.county,
          addressLine: o.addressLine,
          paymentMethod: o.paymentMethod,
          mpesaReceipt: o.mpesaReceipt,
          trackingNumber: o.trackingNumber,
          estimatedDelivery: o.estimatedDelivery,
          createdAt: new Date(o.createdAt),
          items: {
            create: [
              {
                id: `item-${o.id}-1`,
                title: "Standard Order Item",
                price: o.subtotal,
                costPrice: o.cogs,
                quantity: 1,
                image: img("photo-1523275335684-37898b6baf30"),
              },
            ],
          },
        },
      });
    }
  }

  console.log("🎉 ALL TABLES SEEDED SUCCESSFULLY IN NEON DATABASE!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
