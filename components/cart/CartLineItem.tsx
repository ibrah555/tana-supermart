"use client";

import Link from "next/link";
import type { CartItem } from "@/types";
import { formatKes } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { QuantityStepper } from "@/components/product/QuantityStepper";

export function CartLineItem({ item }: { item: CartItem }) {
  const { toggleItem, setQuantity, removeItem } = useCart();
  const { product } = item;

  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={item.selected}
        onChange={() => toggleItem(product.id)}
        aria-label={`Select ${product.name}`}
        className="mt-6 h-4 w-4 shrink-0 accent-primary"
      />

      <Link
        href={`/listing/${product.id}`}
        className="block h-20 w-20 shrink-0 overflow-hidden border border-border bg-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/listing/${product.id}`}
          className="line-clamp-2 text-sm leading-5 text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-0.5 text-xs text-muted">{product.variants?.options[0] ?? "Standard"}</p>

        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(v) => setQuantity(product.id, v)}
          />
          <span className="text-xs text-muted">
            {formatKes(product.price)} each
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-sm font-semibold text-sale">
          {formatKes(product.price * item.quantity)}
        </span>
        <button
          type="button"
          onClick={() => removeItem(product.id)}
          className="text-xs text-muted transition-colors hover:text-sale"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
