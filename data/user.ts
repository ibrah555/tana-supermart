import type { User, Order, Voucher } from "@/types";
import { defaultAddress } from "./address";
import { products } from "./products";

export const initialUser: User = {
  id: "usr_001",
  name: "John Kamau",
  email: "john.kamau@example.co.ke",
  phone: "+254 712 345 678",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  defaultAddress: defaultAddress,
};

export const sampleOrders: Order[] = [
  {
    id: "TS-2026-9821",
    date: "2026-09-20T14:32:00Z",
    status: "Processing",
    items: [
      { product: products[0], quantity: 1, price: products[0].price },
      { product: products[2], quantity: 2, price: products[2].price },
    ],
    totalAmount: products[0].price + products[2].price * 2 + 729,
    paymentMethod: "M-PESA (254712345678)",
    shippingAddress: defaultAddress,
    trackingNumber: "KE-EXP-8849102",
    estimatedDelivery: "Tomorrow by 5:00 PM",
  },
  {
    id: "TS-2026-8430",
    date: "2026-09-12T09:15:00Z",
    status: "Delivered",
    items: [
      { product: products[1], quantity: 1, price: products[1].price },
    ],
    totalAmount: products[1].price + 729,
    paymentMethod: "M-PESA (254712345678)",
    shippingAddress: defaultAddress,
    trackingNumber: "KE-EXP-7729104",
    estimatedDelivery: "Delivered on Sep 14, 2026",
  },
];

export const initialVouchers: Voucher[] = [
  {
    id: "vch_01",
    code: "KARIBU500",
    discountText: "KES 500 OFF orders over KES 2,500",
    minSpend: 2500,
    validUntil: "2026-10-31",
    claimed: false,
  },
  {
    id: "vch_02",
    code: "FREESHIPKE",
    discountText: "Free Delivery Countrywide",
    minSpend: 1500,
    validUntil: "2026-10-15",
    claimed: true,
  },
  {
    id: "vch_03",
    code: "SUPERMART20",
    discountText: "20% OFF Electronics & Appliances",
    minSpend: 5000,
    validUntil: "2026-11-01",
    claimed: false,
  },
];
