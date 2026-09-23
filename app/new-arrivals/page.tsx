"use client";

import Link from "next/link";
import { Sparkles, ShoppingCart, Star } from "lucide-react";
import { newArrivals } from "@/data/products";
import { formatKes } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function NewArrivalsPage() {
  const { addItem } = useCart();

  return (
    <div className="container-app py-4 space-y-4">
      {/* Banner */}
      <div className="rounded-lg bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-cyan-300" />
            <h1 className="text-2xl font-bold tracking-tight">What&apos;s New on Tana-Supermart</h1>
          </div>
          <p className="text-xs text-indigo-100 mt-1">
            Discover the latest electronics, smartphones, fashion & home appliances freshly arrived.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {newArrivals.map((p) => (
          <div
            key={p.id}
            className="group relative flex flex-col justify-between rounded bg-surface p-3 shadow-card transition-shadow hover:shadow-pop border border-border"
          >
            <span className="absolute top-2 left-2 z-10 rounded bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
              NEW
            </span>

            <div>
              <Link href={`/listing/${p.id}`} className="block">
                <div className="relative aspect-square w-full overflow-hidden rounded bg-background p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-2 line-clamp-2 text-xs text-foreground font-medium group-hover:text-primary">
                  {p.name}
                </h3>
              </Link>

              <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold">{p.rating}</span>
                <span className="text-[10px] text-muted">({p.reviews})</span>
              </div>

              <div className="mt-2">
                <span className="text-sm font-bold text-sale">{formatKes(p.price)}</span>
                {p.originalPrice && (
                  <span className="ml-1 text-[11px] text-muted line-through">
                    {formatKes(p.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => addItem(p)}
              className="mt-3 btn-primary w-full h-8 text-xs flex items-center justify-center gap-1"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
