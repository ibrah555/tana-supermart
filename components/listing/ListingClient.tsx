"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/types";
import type { Facet } from "@/data/facets";
import { shippedFromLabel, sharedFacets } from "@/data/facets";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import { SortDropdown, type SortValue } from "./SortDropdown";

const PAGE_SIZE = 12;

interface ListingClientProps {
  categoryName?: string;
  products: Product[];
  suggestions?: string[];
  categoryLinks?: { name: string; slug: string }[];
  facets?: Facet[];
}

export function ListingClient({
  categoryName = "Products",
  products,
  suggestions = [],
  categoryLinks = [],
  facets = sharedFacets,
}: ListingClientProps) {
  const [priceDraft, setPriceDraft] = useState({ min: "", max: "" });
  const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<SortValue>("popular");
  const [page, setPage] = useState(1);

  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((x) => x !== item) : [...list, item];

  const onToggleBrand = (brand: string) => {
    setSelectedBrands((prev) => toggle(prev, brand));
    setPage(1);
  };

  const onToggleFacet = (key: string, option: string) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [key]: toggle(prev[key] ?? [], option),
    }));
    setPage(1);
  };

  const onApplyPrice = () => {
    setAppliedPrice(priceDraft);
    setPage(1);
  };

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      if (p.brand) counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    const min = Number(appliedPrice.min);
    const max = Number(appliedPrice.max);
    if (appliedPrice.min !== "" && !Number.isNaN(min)) {
      list = list.filter((p) => p.price >= min);
    }
    if (appliedPrice.max !== "" && !Number.isNaN(max)) {
      list = list.filter((p) => p.price <= max);
    }
    if (selectedBrands.length > 0) {
      list = list.filter((p) => p.brand && selectedBrands.includes(p.brand));
    }

    const shippedFilters = selectedFacets["shippedFrom"] ?? [];
    if (shippedFilters.length > 0) {
      list = list.filter(
        (p) =>
          p.shippedFrom &&
          shippedFilters.includes(shippedFromLabel[p.shippedFrom])
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        list.sort((a, b) => b.reviews - a.reviews);
    }

    return list;
  }, [products, appliedPrice, selectedBrands, selectedFacets, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <FilterSidebar
        priceDraft={priceDraft}
        onPriceDraftChange={setPriceDraft}
        onApplyPrice={onApplyPrice}
        suggestions={suggestions}
        categoryLinks={categoryLinks}
        facets={facets}
        selectedBrands={selectedBrands}
        onToggleBrand={onToggleBrand}
        selectedFacets={selectedFacets}
        onToggleFacet={onToggleFacet}
        brandCounts={brandCounts}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center justify-between bg-surface px-3 py-2 shadow-card">
          <p className="text-xs text-muted sm:text-sm">
            <strong className="font-semibold text-foreground">
              {filtered.length.toLocaleString()}
            </strong>{" "}
            results for {categoryName}
            <span className="ml-1 text-muted">
              · {safePage}/{pageCount}
            </span>
          </p>
          <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
        </div>

        {pageItems.length > 0 ? (
          <div
            role="list"
            className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4"
          >
            {pageItems.map((p) => (
              <div key={p.id} role="listitem" className="border border-border">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center bg-surface text-sm text-muted shadow-card">
            No products match your filters. Try adjusting or clearing them.
          </div>
        )}

        {pageCount > 1 && (
          <nav
            aria-label="Pagination"
            className="mt-3 flex items-center justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="flex h-8 w-8 items-center justify-center bg-surface text-foreground shadow-card transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <span className="text-sm text-muted tabular-nums">
              {safePage} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage === pageCount}
              aria-label="Next page"
              className="flex h-8 w-8 items-center justify-center bg-surface text-foreground shadow-card transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
