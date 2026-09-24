"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User, Order, Product, Address } from "@/types";
import { initialUser, sampleOrders } from "@/data/user";

interface AuthContextValue {
  user: User;
  orders: Order[];
  wishlist: Product[];
  isAuthenticated: boolean;
  updateUser: (updated: Partial<User>) => void;
  updateAddress: (newAddress: Address) => void;
  addOrder: (order: Order) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "tana-supermart-user";
const ORDERS_STORAGE_KEY = "tana-supermart-orders";
const WISHLIST_STORAGE_KEY = "tana-supermart-wishlist";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) setUser(JSON.parse(storedUser));

      const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    } catch {
      // fallback to initial
    } finally {
      setHydrated(true);
      // Fetch live user orders from backend API
      fetch("/api/orders?limit=20")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.orders && data.orders.length > 0) {
            const mapped = data.orders.map((o: any) => ({
              id: o.orderNumber || o.id,
              date: o.createdAt || new Date().toISOString(),
              status: o.status === "DELIVERED" ? "Delivered" : o.status === "SHIPPED" ? "Shipped" : o.status === "CANCELLED" ? "Cancelled" : "Processing",
              items: (o.items || []).map((item: any) => ({
                product: {
                  id: item.productId || item.id,
                  name: item.title,
                  price: Number(item.price),
                  costPrice: Number(item.costPrice || 0),
                  image: item.image || "",
                  categorySlug: "general",
                  storeId: "tana-direct",
                  stockQuantity: 10,
                  rating: 5,
                  reviews: 1,
                  inStock: true,
                },
                quantity: Number(item.quantity || 1),
                price: Number(item.price),
                costPrice: Number(item.costPrice || 0),
              })),
              totalAmount: Number(o.total || 0),
              cogs: Number(o.cogs || 0),
              profit: Number(o.profit || 0),
              paymentMethod: o.mpesaReceipt ? `M-PESA (${o.mpesaReceipt})` : (o.paymentMethod || "M-PESA"),
              shippingAddress: {
                fullName: o.customerName || "Customer",
                phone: o.customerPhone || "+254 700 000 000",
                addressLines: [o.addressLine || "Kenya"],
                city: o.county || "Nairobi",
                county: o.county || "Nairobi",
              },
              trackingNumber: o.trackingNumber || "KE-EXP-9182310",
              estimatedDelivery: o.estimatedDelivery || "2-3 Business Days",
            }));
            setOrders(mapped);
          }
        })
        .catch(console.warn);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {}
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch {}
  }, [wishlist, hydrated]);

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const updateAddress = (newAddress: Address) => {
    setUser((prev) => ({ ...prev, defaultAddress: newAddress }));
  };

  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [product, ...prev];
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      orders,
      wishlist,
      isAuthenticated: true,
      updateUser,
      updateAddress,
      addOrder,
      toggleWishlist,
      isInWishlist,
    }),
    [user, orders, wishlist]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
