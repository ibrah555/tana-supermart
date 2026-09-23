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
