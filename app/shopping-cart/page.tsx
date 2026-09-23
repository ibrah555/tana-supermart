"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { stores } from "@/data/stores";
import { recommendedProducts } from "@/data/products";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { CartSummaryBar } from "@/components/cart/CartSummaryBar";
import { ProductRail } from "@/components/home/ProductRail";
import type { CartItem } from "@/types";

export default function ShoppingCartPage() {
  const { items, setAllSelected, removeItem, selectedTotal, selectedCount, totalCount } =
    useCart();

  const groups = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const item of items) {
      const list = map.get(item.product.storeId) ?? [];
      list.push(item);
      map.set(item.product.storeId, list);
    }
    return [...map.entries()].map(([storeId, storeItems]) => ({
      store: stores.find((s) => s.id === storeId) ?? {
        id: storeId,
        name: storeId,
        score: 0,
        productCount: 0,
        followers: 0,
      },
      items: storeItems,
    }));
  }, [items]);

  const allSelected = items.length > 0 && items.every((i) => i.selected);

  function deleteSelected() {
    items.filter((i) => i.selected).forEach((i) => removeItem(i.product.id));
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-lg font-bold text-foreground">Shopping Cart</h1>
        <p className="mt-2 text-sm text-muted">Your cart is empty.</p>
        <Link href="/" className="btn-primary mt-6">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container-app py-3">
        <h1 className="mb-3 text-base font-bold text-foreground">Shopping Cart</h1>

        <div className="flex items-center gap-6 bg-surface px-4 py-2.5 shadow-card">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => setAllSelected(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Select All
          </label>
          <button
            type="button"
            onClick={deleteSelected}
            className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-sale"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </button>
          <span className="ml-auto text-xs text-muted">
            {totalCount} item{totalCount === 1 ? "" : "s"} in cart
          </span>
        </div>

        {groups.map(({ store, items: storeItems }) => (
          <section
            key={store.id}
            aria-label={`Items from ${store.name}`}
            className="mt-3 bg-surface shadow-card"
          >
            <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="flex h-6 w-6 items-center justify-center bg-foreground text-[10px] font-bold text-white">
                {store.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-sm font-semibold text-foreground">{store.name}</span>
              <span className="text-xs text-muted">· Score {store.score.toFixed(1)}</span>
            </header>
            <ul className="divide-y divide-border">
              {storeItems.map((item: CartItem) => (
                <CartLineItem key={item.product.id} item={item} />
              ))}
            </ul>
          </section>
        ))}

        <ProductRail
          title="You May Also Like"
          products={recommendedProducts}
          viewMoreHref="/products"
        />
      </div>

      <CartSummaryBar selectedTotal={selectedTotal} selectedCount={selectedCount} />
    </>
  );
}
