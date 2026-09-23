import { Zap } from "lucide-react";
import Link from "next/link";
import { flashSaleProducts } from "@/data/products";
import { ProductCard } from "@/components/ui/ProductCard";
import { Countdown } from "@/components/ui/Countdown";

export function FlashSaleStrip() {
  const endsAt = flashSaleProducts[0]?.flashSaleEndsAt ?? new Date().toISOString();

  return (
    <section
      aria-labelledby="flash-sale-heading"
      className="mt-4 bg-surface py-3 shadow-card"
    >
      <div className="container-app">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-sale" aria-hidden />
            <h2
              id="flash-sale-heading"
              className="text-base font-bold uppercase text-sale"
            >
              Flash Sale
            </h2>
            <span className="ml-3 hidden items-center gap-1.5 text-xs text-muted sm:flex">
              Ends in <Countdown endsAt={endsAt} />
            </span>
          </div>
          <Link
            href="/flash-sale"
            className="text-xs font-medium text-muted transition-colors hover:text-primary"
          >
            View more ›
          </Link>
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:thin]"
          role="list"
        >
          {flashSaleProducts.map((p) => (
            <div key={p.id} role="listitem" className="border border-border">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
