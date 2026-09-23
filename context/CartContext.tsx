"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; product: Product; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "TOGGLE_ITEM"; productId: string }
  | { type: "SET_ALL_SELECTED"; selected: boolean }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + action.quantity }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { product: action.product, quantity: action.quantity, selected: true },
        ],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "SET_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((i) => i.product.id !== action.productId),
        };
      }
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ),
      };
    }
    case "TOGGLE_ITEM":
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId ? { ...i, selected: !i.selected } : i
        ),
      };
    case "SET_ALL_SELECTED":
      return {
        items: state.items.map((i) => ({ ...i, selected: action.selected })),
      };
    case "CLEAR":
      return { items: [] };
    case "HYDRATE":
      return { items: action.items };
  }
}

interface CartContextValue extends CartState {
  totalCount: number;
  selectedCount: number;
  selectedTotal: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  toggleItem: (productId: string) => void;
  setAllSelected: (selected: boolean) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tana-supermart-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: "HYDRATE", items: parsed });
        }
      }
    } catch {
      // corrupted storage — start fresh
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // storage full or unavailable — ignore
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const selected = state.items.filter((i) => i.selected);
    const selectedCount = selected.reduce((sum, i) => sum + i.quantity, 0);
    const selectedTotal = selected.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
    return {
      ...state,
      totalCount,
      selectedCount,
      selectedTotal,
      addItem: (product, quantity = 1) =>
        dispatch({ type: "ADD", product, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "SET_QUANTITY", productId, quantity }),
      toggleItem: (productId) => dispatch({ type: "TOGGLE_ITEM", productId }),
      setAllSelected: (selected) =>
        dispatch({ type: "SET_ALL_SELECTED", selected }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
