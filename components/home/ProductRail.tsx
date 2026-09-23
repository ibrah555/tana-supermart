import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";

interface ProductRailProps {
  title: string;
  products: Product[];
  viewMoreHref: string;
}

export function ProductRail({ title, products, viewMoreHref }: ProductRailProps) {
  return (
    <section aria-label={title} className="mt-4 bg-surface py-3 shadow-card">
      <div className="container-app">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <Link
            href={viewMoreHref}
            className="text-xs font-medium text-muted transition-colors hover:text-primary"
          >
            View More ›
          </Link>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="list">
          {products.map((p) => (
            <div key={p.id} role="listitem" className="border border-border">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
