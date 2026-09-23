"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CartItem, Store } from "@/types";
import { formatKes } from "@/lib/format";
import { MoneyBackStrip } from "@/components/cart/MoneyBackStrip";

interface OrderSummaryProps {
  groups: { store: Store; items: CartItem[] }[];
  productAmount: number;
  shippingFee: number;
  placing: boolean;
  onPlaceOrder: () => void;
}

export function OrderSummary({
  groups,
  productAmount,
  shippingFee,
  placing,
  onPlaceOrder,
}: OrderSummaryProps) {
  const total = productAmount + shippingFee;

  return (
    <section aria-labelledby="order-summary-heading" className="bg-surface shadow-card">
      <header className="flex items-baseline gap-3 border-b border-border px-4 py-3">
        <h2 id="order-summary-heading" className="text-sm font-bold text-foreground">
          Product List
        </h2>
        <span className="text-xs text-muted">
          (Summary: {groups.reduce((n, g) => n + g.items.length, 0)} item(s))
        </span>
      </header>

      {groups.map(({ store, items }) => (
        <div key={store.id} className="border-b border-border px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="flex h-5 w-5 items-center justify-center bg-foreground text-[9px] font-bold text-white">
              {store.name.slice(0, 2).toUpperCase()}
            </span>
            {store.name}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
            <MapPin className="h-3.5 w-3.5" aria-hidden />
            Local Dispatch
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Ships from Nairobi Central, arrives in Bura within 5-12 workdays.
          </p>

          <ul className="mt-2 divide-y divide-border">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3 py-2.5">
                <span className="block h-14 w-14 shrink-0 overflow-hidden border border-border bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <Link
                    href={`/listing/${product.id}`}
                    className="line-clamp-2 text-xs leading-4 text-foreground transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <span className="mt-1 block text-[11px] text-muted">x{quantity}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-sale">
                  {formatKes(product.price * quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
        <span className="font-semibold text-foreground">Discount</span>
        <Link href="/voucher-center" className="text-xs text-muted hover:text-primary">
          Voucher Used <span className="text-sale">(0 available)</span> ›
        </Link>
      </div>

      <div className="px-4 py-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <MoneyBackStrip />
          <dl className="w-56 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Product Amount</dt>
              <dd className="tabular-nums">{formatKes(productAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Shipping Fee</dt>
              <dd className="tabular-nums">+ {formatKes(shippingFee)}</dd>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 font-semibold">
              <dt className="text-foreground">Payment Amount</dt>
              <dd className="text-sale">{formatKes(total)}</dd>
            </div>
          </dl>
        </div>

        <button
          type="button"
          disabled={placing || productAmount === 0}
          onClick={onPlaceOrder}
          className="btn-sale mt-4 h-11 w-full text-base disabled:opacity-50"
        >
          {placing ? "Processing..." : "Place Order"}
        </button>
      </div>
    </section>
  );
}
