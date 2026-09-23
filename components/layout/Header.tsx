"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User } from "lucide-react";
import { Logo } from "./Logo";
import { hotKeywords } from "@/data/categories";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export function Header() {
  const router = useRouter();
  const { totalCount } = useCart();
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/products");
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-surface transition-shadow",
        scrolled && "shadow-pop"
      )}
    >
      <div className="container-app flex items-center gap-4 py-3 sm:gap-6">
        <Logo />

        <div className="min-w-0 flex-1">
          <form onSubmit={handleSubmit} role="search" className="flex">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="I'm looking for..."
              className="h-10 min-w-0 flex-1 rounded-l-md border border-r-0 border-border px-3 text-sm outline-none placeholder:text-muted focus:border-primary"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex h-10 w-12 items-center justify-center rounded-r-md bg-primary text-white transition-colors hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Search className="h-4 w-4" aria-hidden />
            </button>
          </form>

          <ul className="mt-1.5 hidden items-center gap-4 overflow-hidden whitespace-nowrap text-[11px] text-muted md:flex">
            {hotKeywords.map((kw) => (
              <li key={kw}>
                <Link
                  href={`/search?q=${encodeURIComponent(kw)}`}
                  className="transition-colors hover:text-primary"
                >
                  {kw}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <Link
            href="/shopping-cart"
            className="relative flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
            aria-label={`Cart, ${totalCount} items`}
          >
            <span className="relative">
              <ShoppingCart className="h-5 w-5" aria-hidden />
              {totalCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                  {totalCount > 99 ? "99+" : totalCount}
                </span>
              )}
            </span>
            <span className="hidden lg:inline">Cart</span>
          </Link>

          <Link
            href="/account"
            className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary"
          >
            <User className="h-5 w-5" aria-hidden />
            <span className="hidden lg:inline">My Account</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
