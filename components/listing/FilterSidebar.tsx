"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Facet } from "@/data/facets";
import { cn } from "@/lib/utils";

const COLLAPSED_COUNT = 5;

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-border px-4 py-3">
      <legend className="sr-only">{title}</legend>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </fieldset>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 text-sm text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 accent-primary"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-muted">({count})</span>}
    </label>
  );
}

interface FilterSidebarProps {
  priceDraft: { min: string; max: string };
  onPriceDraftChange: (draft: { min: string; max: string }) => void;
  onApplyPrice: () => void;
  suggestions: string[];
  categoryLinks: { name: string; slug: string }[];
  facets: Facet[];
  selectedBrands: string[];
  onToggleBrand: (brand: string) => void;
  selectedFacets: Record<string, string[]>;
  onToggleFacet: (key: string, option: string) => void;
  brandCounts: Record<string, number>;
}

export function FilterSidebar({
  priceDraft,
  onPriceDraftChange,
  onApplyPrice,
  suggestions,
  categoryLinks,
  facets,
  selectedBrands,
  onToggleBrand,
  selectedFacets,
  onToggleFacet,
  brandCounts,
}: FilterSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <aside aria-label="Search filter" className="w-full shrink-0 bg-surface shadow-card lg:w-56">
      <h2 className="border-b border-border px-4 py-2.5 text-sm font-bold text-foreground">
        Search filter
      </h2>

      <FilterSection title="Price (KSh)">
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">Minimum price</label>
          <input
            id="price-min"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Min"
            value={priceDraft.min}
            onChange={(e) => onPriceDraftChange({ ...priceDraft, min: e.target.value })}
            className="h-8 w-full min-w-0 rounded border border-border px-2 text-sm outline-none focus:border-primary"
          />
          <span className="text-muted">-</span>
          <label className="sr-only" htmlFor="price-max">Maximum price</label>
          <input
            id="price-max"
            type="number"
            min={0}
            inputMode="numeric"
            placeholder="Max"
            value={priceDraft.max}
            onChange={(e) => onPriceDraftChange({ ...priceDraft, max: e.target.value })}
            className="h-8 w-full min-w-0 rounded border border-border px-2 text-sm outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={onApplyPrice}
            className="h-8 shrink-0 bg-primary px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            Apply
          </button>
        </div>
      </FilterSection>

      {suggestions.length > 0 && (
        <FilterSection title="Suggestions">
          <ul className="space-y-1">
            {suggestions.map((s) => (
              <li key={s}>
                <Link
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block py-0.5 text-sm text-foreground transition-colors hover:text-primary"
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {categoryLinks.length > 0 && (
        <FilterSection title="Category">
          <ul className="space-y-1">
            {categoryLinks.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="block py-0.5 text-sm text-foreground transition-colors hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {facets.map((facet) => {
        const isBrand = facet.key === "brand";
        const selected = isBrand
          ? selectedBrands
          : (selectedFacets[facet.key] ?? []);
        const isExpanded = expanded[facet.key] ?? false;
        const visible = isExpanded
          ? facet.options
          : facet.options.slice(0, COLLAPSED_COUNT);

        return (
          <FilterSection key={facet.key} title={facet.label}>
            {visible.map((option) => (
              <CheckboxRow
                key={option}
                label={option}
                checked={selected.includes(option)}
                onChange={() =>
                  isBrand
                    ? onToggleBrand(option)
                    : onToggleFacet(facet.key, option)
                }
                count={isBrand ? brandCounts[option] : undefined}
              />
            ))}
            {facet.options.length > COLLAPSED_COUNT && (
              <button
                type="button"
                onClick={() =>
                  setExpanded((prev) => ({ ...prev, [facet.key]: !isExpanded }))
                }
                className="mt-1 flex items-center gap-1 text-xs font-medium text-primary"
                aria-expanded={isExpanded}
              >
                {isExpanded ? "View Less" : "View More"}
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform", isExpanded && "rotate-180")}
                  aria-hidden
                />
              </button>
            )}
          </FilterSection>
        );
      })}
    </aside>
  );
}
