"use client";

import { useState } from "react";
import type { Product } from "@/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

const TABS = ["Description", "Reviews", "Recommend"] as const;
type Tab = (typeof TABS)[number];

function SpecTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs);
  const midpoint = Math.ceil(entries.length / 2);
  const columns = [entries.slice(0, midpoint), entries.slice(midpoint)];

  return (
    <div className="grid gap-x-8 sm:grid-cols-2">
      {columns.map((col, i) => (
        <dl key={i}>
          {col.map(([k, v]) => (
            <div
              key={k}
              className="flex border-b border-border py-2 text-sm"
            >
              <dt className="w-1/2 text-muted">{k}</dt>
              <dd className="w-1/2 text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      ))}
    </div>
  );
}

export function DetailTabs({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [tab, setTab] = useState<Tab>("Description");
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const visibleSpecs = showAllSpecs
    ? (product.specs ?? {})
    : Object.fromEntries(Object.entries(product.specs ?? {}).slice(0, 6));

  return (
    <section className="mt-4 bg-surface shadow-card" aria-label="Product details">
      <div role="tablist" aria-label="Product information" className="flex border-b border-border">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-3 text-sm font-semibold transition-colors",
              tab === t
                ? "border-b-2 border-sale text-sale"
                : "text-foreground hover:text-primary"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4">
        {tab === "Description" && (
          <div role="tabpanel" id="panel-Description" aria-labelledby="tab-Description" className="space-y-4">
            {product.specs && (
              <div>
                <h3 className="mb-2 text-sm font-bold text-foreground">Specification</h3>
                <SpecTable specs={visibleSpecs} />
                {Object.keys(product.specs).length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllSpecs((v) => !v)}
                    aria-expanded={showAllSpecs}
                    className="mt-2 text-xs font-medium text-primary"
                  >
                    {showAllSpecs ? "Show less" : "Show more ⌄"}
                  </button>
                )}
              </div>
            )}

            {product.boxContents && (
              <div>
                <h3 className="mb-2 text-sm font-bold text-foreground">
                  What&apos;s in the box
                </h3>
                <ul className="list-inside list-disc text-sm text-foreground">
                  {product.boxContents.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {tab === "Reviews" && (
          <div role="tabpanel" id="panel-Reviews" aria-labelledby="tab-Reviews" className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-foreground">
                {product.rating.toFixed(1)}
              </span>
              <div>
                <RatingStars rating={product.rating} />
                <p className="mt-1 text-xs text-muted">
                  Based on {product.reviews.toLocaleString()} verified reviews
                </p>
              </div>
            </div>
            <p className="text-sm text-muted">
              Customers praise this item for value for money and fast delivery.
              Reviews are verified against completed orders.
            </p>
          </div>
        )}

        {tab === "Recommend" && (
          <div
            role="tabpanel"
            id="panel-Recommend"
            aria-labelledby="tab-Recommend"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
          >
            {related.map((p) => (
              <div key={p.id} className="border border-border">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
