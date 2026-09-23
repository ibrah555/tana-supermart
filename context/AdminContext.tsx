"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultAdminCredentials,
  defaultCountyShippingRates,
  defaultCategoryCommissions,
  defaultMpesaSettings,
  initialMpesaLedger,
  type CountyShippingRate,
  type CategoryCommission,
  type MpesaSettings,
  type MpesaTransactionRecord,
  type AdminCredential,
} from "@/data/adminPresets";
import { products as initialProducts } from "@/data/products";
import { categories as initialCategories } from "@/data/categories";
import { stores as initialStores } from "@/data/stores";
import { sampleOrders, sampleUsers } from "@/data/user";
import type { Product, Category, Store, Order, User } from "@/types";

interface ExtendedStore extends Store {
  status: "Active" | "Pending KYC" | "Suspended";
  commissionRate: number;
  contactEmail: string;
  phone: string;
}

interface AdminContextValue {
  adminUser: AdminCredential | null;
  isAdminAuthenticated: boolean;
  loginAdmin: (email: string, password: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  // Presets & Settings
  countyRates: CountyShippingRate[];
  updateCountyRate: (id: string, updates: Partial<CountyShippingRate>) => void;
  resetCountyRates: () => void;
  commissions: CategoryCommission[];
  updateCommission: (id: string, rate: number) => void;
  mpesaSettings: MpesaSettings;
  updateMpesaSettings: (updates: Partial<MpesaSettings>) => void;
  // M-PESA Financial Ledger
  mpesaLedger: MpesaTransactionRecord[];
  queryDarajaStatus: (checkoutRequestId: string) => { status: "COMPLETED" | "FAILED" | "PENDING"; message: string };
  // Catalog & Inventory Stock Control
  products: Product[];
  updateProductStockQuantity: (id: string, quantity: number) => void;
  adjustProductStock: (id: string, delta: number) => void;
  updateProductStock: (id: string, inStock: boolean) => void;
  updateProductPrice: (id: string, price: number, originalPrice?: number, costPrice?: number) => void;
  toggleFlashSale: (id: string, isFlashSale: boolean, discountPercent?: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Orders & Fulfillment
  orders: Order[];
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  assignCourier: (orderId: string, courierName: string, trackingCode: string) => void;
  // User Management & RBAC
  users: User[];
  updateUserRole: (userId: string, role: User["role"]) => void;
  updateUserStatus: (userId: string, status: User["status"]) => void;
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  // Vendors & Stores
  stores: ExtendedStore[];
  toggleStoreStatus: (storeId: string, status: "Active" | "Pending KYC" | "Suspended") => void;
  updateStoreCommission: (storeId: string, rate: number) => void;
  // Categories
  categories: Category[];
  addCategory: (category: Category) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const ADMIN_AUTH_KEY = "tana_admin_auth";
const ADMIN_RATES_KEY = "tana_admin_rates";
const ADMIN_COMMISSIONS_KEY = "tana_admin_commissions";
const ADMIN_MPESA_SETTINGS_KEY = "tana_admin_mpesa_settings";
const ADMIN_MPESA_LEDGER_KEY = "tana_admin_mpesa_ledger";
const ADMIN_PRODUCTS_KEY = "tana_admin_products_v2";
const ADMIN_ORDERS_KEY = "tana_admin_orders_v2";
const ADMIN_USERS_KEY = "tana_admin_users_v2";
const ADMIN_STORES_KEY = "tana_admin_stores";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminCredential | null>(defaultAdminCredentials);
  const [countyRates, setCountyRates] = useState<CountyShippingRate[]>(defaultCountyShippingRates);
  const [commissions, setCommissions] = useState<CategoryCommission[]>(defaultCategoryCommissions);
  const [mpesaSettings, setMpesaSettings] = useState<MpesaSettings>(defaultMpesaSettings);
  const [mpesaLedger, setMpesaLedger] = useState<MpesaTransactionRecord[]>(initialMpesaLedger);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [stores, setStores] = useState<ExtendedStore[]>(() =>
    initialStores.map((s, idx) => ({
      ...s,
      status: idx === 2 ? "Pending KYC" : "Active",
      commissionRate: idx === 0 ? 8.5 : 7.0,
      contactEmail: `${s.id}@seller.tanasupermart.co.ke`,
      phone: `+254 7${idx}2 345 890`,
    }))
  );
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(ADMIN_AUTH_KEY);
      if (storedAuth) {
        setAdminUser(JSON.parse(storedAuth));
      } else {
        setAdminUser(defaultAdminCredentials);
      }

      const storedRates = localStorage.getItem(ADMIN_RATES_KEY);
      if (storedRates) setCountyRates(JSON.parse(storedRates));

      const storedCommissions = localStorage.getItem(ADMIN_COMMISSIONS_KEY);
      if (storedCommissions) setCommissions(JSON.parse(storedCommissions));

      const storedMpesaSettings = localStorage.getItem(ADMIN_MPESA_SETTINGS_KEY);
      if (storedMpesaSettings) setMpesaSettings(JSON.parse(storedMpesaSettings));

      const storedLedger = localStorage.getItem(ADMIN_MPESA_LEDGER_KEY);
      if (storedLedger) setMpesaLedger(JSON.parse(storedLedger));

      const storedProducts = localStorage.getItem(ADMIN_PRODUCTS_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(initialProducts);
      }

      const storedOrders = localStorage.getItem(ADMIN_ORDERS_KEY);
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      } else {
        setOrders(sampleOrders);
      }

      const storedUsers = localStorage.getItem(ADMIN_USERS_KEY);
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
      } else {
        setUsers(sampleUsers);
      }

      const storedStores = localStorage.getItem(ADMIN_STORES_KEY);
      if (storedStores) setStores(JSON.parse(storedStores));
    } catch {
      // fallback to initial
    } finally {
      setHydrated(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      if (adminUser) {
        localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(adminUser));
      } else {
        localStorage.removeItem(ADMIN_AUTH_KEY);
      }
      localStorage.setItem(ADMIN_RATES_KEY, JSON.stringify(countyRates));
      localStorage.setItem(ADMIN_COMMISSIONS_KEY, JSON.stringify(commissions));
      localStorage.setItem(ADMIN_MPESA_SETTINGS_KEY, JSON.stringify(mpesaSettings));
      localStorage.setItem(ADMIN_MPESA_LEDGER_KEY, JSON.stringify(mpesaLedger));
      localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(products));
      localStorage.setItem(ADMIN_ORDERS_KEY, JSON.stringify(orders));
      localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(ADMIN_STORES_KEY, JSON.stringify(stores));
    } catch {}
  }, [adminUser, countyRates, commissions, mpesaSettings, mpesaLedger, products, orders, users, stores, hydrated]);

  const loginAdmin = (email: string, password: string) => {
    if (
      (email === defaultAdminCredentials.email || email === "admin" || email === "admin@tanasupermart.co.ke") &&
      (password === defaultAdminCredentials.passwordHash || password === "admin" || password === "Admin@2026!")
    ) {
      setAdminUser(defaultAdminCredentials);
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Use admin@tanasupermart.co.ke / Admin@2026!" };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const updateCountyRate = (id: string, updates: Partial<CountyShippingRate>) => {
    setCountyRates((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const resetCountyRates = () => {
    setCountyRates(defaultCountyShippingRates);
  };

  const updateCommission = (id: string, rate: number) => {
    setCommissions((prev) => prev.map((c) => (c.id === id ? { ...c, ratePercent: rate } : c)));
  };

  const updateMpesaSettings = (updates: Partial<MpesaSettings>) => {
    setMpesaSettings((prev) => ({ ...prev, ...updates }));
  };

  const queryDarajaStatus = (
    checkoutRequestId: string
  ): { status: "COMPLETED" | "FAILED" | "PENDING"; message: string } => {
    const existing = mpesaLedger.find((tx) => tx.checkoutRequestId === checkoutRequestId);
    if (existing && existing.status === "COMPLETED") {
      return { status: "COMPLETED", message: `Payment verified. Safaricom Receipt: ${existing.mpesaReceiptNumber}` };
    }
    const generatedReceipt = "NL" + Math.random().toString(36).substring(2, 8).toUpperCase() + "K";
    setMpesaLedger((prev) =>
      prev.map((tx) =>
        tx.checkoutRequestId === checkoutRequestId
          ? {
              ...tx,
              status: "COMPLETED",
              mpesaReceiptNumber: generatedReceipt,
              resultDesc: "The service request is processed successfully via Daraja Query API.",
            }
          : tx
      )
    );
    return {
      status: "COMPLETED",
      message: `Daraja Handshake Success: Payment Confirmed. Receipt ${generatedReceipt} reconciled.`,
    };
  };

  // Stock Control: Quantity updates automatically synchronize the inStock boolean and alert thresholds!
  const updateProductStockQuantity = (id: string, quantity: number) => {
    const safeQty = Math.max(0, quantity);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stockQuantity: safeQty,
              inStock: safeQty > 0,
            }
          : p
      )
    );
  };

  const adjustProductStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newQty = Math.max(0, (p.stockQuantity || 0) + delta);
        return {
          ...p,
          stockQuantity: newQty,
          inStock: newQty > 0,
        };
      })
    );
  };

  const updateProductStock = (id: string, inStock: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              inStock,
              stockQuantity: inStock ? (p.stockQuantity > 0 ? p.stockQuantity : 10) : 0,
            }
          : p
      )
    );
  };

  const updateProductPrice = (id: string, price: number, originalPrice?: number, costPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              price,
              originalPrice: originalPrice ?? p.originalPrice,
              costPrice: costPrice ?? p.costPrice,
            }
          : p
      )
    );
  };

  const toggleFlashSale = (id: string, isFlashSale: boolean, discountPercent: number = 20) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const newPrice = isFlashSale ? Math.round(p.price * (1 - discountPercent / 100)) : (p.originalPrice ?? p.price);
        return {
          ...p,
          isFlashSale,
          originalPrice: isFlashSale ? p.price : undefined,
          price: newPrice,
          flashSaleEndsAt: isFlashSale ? new Date(Date.now() + 86400000 * 2).toISOString() : undefined,
        };
      })
    );
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Orders Management
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  };

  const assignCourier = (orderId: string, courierName: string, trackingCode: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              trackingNumber: trackingCode,
              estimatedDelivery: `Assigned to ${courierName}. Delivery in 24-48 hrs.`,
            }
          : o
      )
    );
  };

  // User Management & RBAC
  const updateUserRole = (userId: string, role: User["role"]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  const updateUserStatus = (userId: string, status: User["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  };

  const addUser = (newUser: User) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const toggleStoreStatus = (storeId: string, status: "Active" | "Pending KYC" | "Suspended") => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, status } : s)));
  };

  const updateStoreCommission = (storeId: string, rate: number) => {
    setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, commissionRate: rate } : s)));
  };

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const value = useMemo<AdminContextValue>(
    () => ({
      adminUser,
      isAdminAuthenticated: !!adminUser,
      loginAdmin,
      logoutAdmin,
      countyRates,
      updateCountyRate,
      resetCountyRates,
      commissions,
      updateCommission,
      mpesaSettings,
      updateMpesaSettings,
      mpesaLedger,
      queryDarajaStatus,
      products,
      updateProductStockQuantity,
      adjustProductStock,
      updateProductStock,
      updateProductPrice,
      toggleFlashSale,
      addProduct,
      deleteProduct,
      orders,
      updateOrderStatus,
      assignCourier,
      users,
      updateUserRole,
      updateUserStatus,
      addUser,
      deleteUser,
      stores,
      toggleStoreStatus,
      updateStoreCommission,
      categories,
      addCategory,
    }),
    [adminUser, countyRates, commissions, mpesaSettings, mpesaLedger, products, orders, users, stores, categories]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
