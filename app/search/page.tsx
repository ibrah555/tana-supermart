"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ListingClient } from "@/components/listing/ListingClient";
import { products } from "@/data/products";
import { sharedFacets } from "@/data/facets";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [q]);

  return (
    <div className="container-app py-2">
      <Breadcrumb items={[{ label: q ? `Search: "${q}"` : "Search" }]} />
      <ListingClient
        categoryName={q ? `"${q}"` : "all products"}
        products={results}
        suggestions={[]}
        categoryLinks={[]}
        facets={sharedFacets}
      />
    </div>
  );
}
