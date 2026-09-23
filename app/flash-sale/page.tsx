"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Clock, ShoppingCart, ShieldCheck } from "lucide-react";
import { products } from "@/data/products";
import { formatKes } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function FlashSalePage() {
  const { addItem } = useCart();
  const flashProducts = products.filter((p) => p.isFlashSale);

  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container-app py-4 space-y-4">
      {/* Banner */}
      <div className="rounded-lg bg-gradient-to-r from-red-600 via-amber-600 to-red-700 p-6 text-white shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-300 fill-yellow-300 animate-bounce" />
            <h1 className="text-2xl font-black tracking-tight uppercase">Flash Sale Mega Deals</h1>
          </div>
          <p className="text-xs text-amber-100 mt-1">
            Limited quantity deals up to 80% OFF. Delivered across Kenya.
          </p>
        </div>

        {/* Countdown Timer Display */}
        <div className="flex items-center gap-2 bg-black/40 px-4 py-2.5 rounded-lg border border-white/20">
          <Clock className="h-4 w-4 text-yellow-300" />
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">Ends In:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-sm">
            <span className="bg-white text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-white text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span>:</span>
            <span className="bg-white text-zinc-900 px-2 py-1 rounded">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Flash Sale Product Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {flashProducts.map((p) => {
          const discountPct = p.originalPrice
            ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
            : 40;
          const soldPct = 65 + (p.name.length % 30);

          return (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between rounded bg-surface p-3 shadow-card transition-shadow hover:shadow-pop border border-border"
            >
              {/* Discount Badge */}
              <span className="absolute top-2 left-2 z-10 rounded bg-sale px-1.5 py-0.5 text-[11px] font-extrabold text-white">
                -{discountPct}%
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

                <div className="mt-2">
                  <span className="text-sm font-bold text-sale">{formatKes(p.price)}</span>
                  {p.originalPrice && (
                    <span className="ml-1 text-[11px] text-muted line-through">
                      {formatKes(p.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Stock Progress Bar */}
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full"
                      style={{ width: `${soldPct}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted font-medium">{soldPct}% Claimed</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => addItem(p)}
                className="mt-3 btn-primary w-full h-8 text-xs flex items-center justify-center gap-1"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Buy Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
