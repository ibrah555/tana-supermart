export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: any; // lucide icon identifier or component
  children?: Category[];
}

export interface Store {
  id: string;
  name: string;
  score: number;
  productCount: number;
  followers: number;
}

export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  subCategorySlug?: string;
  storeId: string;
  price: number;            // KES
  originalPrice?: number;   // struck-through reference price
  image: string;
  gallery?: string[];       // additional images for the detail page
  rating: number;           // 0-5
  reviews: number;
  inStock: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string; // ISO datetime
  fulfilledByPlatform?: boolean;
  brandOfficial?: boolean;
  variants?: { name: string; options: string[] };
  dispatchInfo?: string;
  brand?: string;
  shippedFrom?: "platform" | "overseas" | "local";
  specs?: Record<string, string>;
  boxContents?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Address {
  fullName: string;
  phone: string;
  addressLines: string[];
  city: string;
  county: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  defaultAddress: Address;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string; // ISO date string
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: Address;
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface Voucher {
  id: string;
  code: string;
  discountText: string;
  minSpend: number;
  validUntil: string;
  claimed: boolean;
}
