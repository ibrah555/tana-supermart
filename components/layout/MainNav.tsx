"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, LayoutGrid, Sparkles, Zap } from "lucide-react";
import { categories } from "@/data/categories";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

function CategoryRow({
  category,
  active,
  onActivate,
}: {
  category: Category;
  active: boolean;
  onActivate: () => void;
}) {
  const Icon = category.icon ?? LayoutGrid;
  const hasChildren = !!category.children?.length;

  return (
    <Link
      href={`/category/${category.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={cn(
        "flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
        active ? "bg-background font-semibold text-primary" : "text-foreground hover:bg-background"
      )}
    >
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-muted" aria-hidden />
        {category.name}
      </span>
      {hasChildren && <ChevronRight className="h-4 w-4 text-muted" aria-hidden />}
    </Link>
  );
}

export function MainNav() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const activeCategory = categories.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: PointerEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      className="border-b border-border bg-surface"
      onMouseLeave={() => setActiveId(null)}
    >
      <div className="container-app relative flex items-stretch gap-1">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          onMouseEnter={() => setOpen(true)}
          className="flex h-11 w-56 items-center justify-between bg-sale px-4 text-sm font-semibold text-white transition-colors hover:bg-sale-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sale"
        >
          <span className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" aria-hidden />
            Category
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>

        <Link
          href="/new-arrivals"
          className="flex items-center gap-1.5 px-4 text-sm font-medium text-foreground transition-colors hover:text-primary"
        >
          <Sparkles className="h-4 w-4 text-primary" aria-hidden />
          What&apos;s New
        </Link>
        <Link
          href="/flash-sale"
          className="flex items-center gap-1.5 px-4 text-sm font-medium text-foreground transition-colors hover:text-sale"
        >
          <Zap className="h-4 w-4 text-sale" aria-hidden />
          Flash Sale
        </Link>

        {open && (
          <div
            role="menu"
            aria-label="Product categories"
            className="absolute left-3 top-full z-50 flex w-[34rem] border border-border bg-surface shadow-pop"
            onMouseLeave={() => setOpen(false)}
          >
            <ul className="max-h-[26rem] w-56 overflow-y-auto py-1">
              {categories.map((cat) => (
                <li key={cat.id} role="none">
                  <CategoryRow
                    category={cat}
                    active={activeId === cat.id}
                    onActivate={() => setActiveId(cat.id)}
                  />
                </li>
              ))}
            </ul>

            {activeCategory?.children?.length ? (
              <div className="flex-1 border-l border-border bg-background p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted">
                  {activeCategory.name}
                </h3>
                <ul className="grid grid-cols-2 gap-1">
                  {activeCategory.children.map((child) => (
                    <li key={child.id}>
                      <Link
                        href={`/category/${child.slug}`}
                        className="block rounded px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface hover:text-primary"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center border-l border-border bg-background p-4">
                <p className="text-sm text-muted">
                  Browse all deals in {activeCategory?.name ?? "every category"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
