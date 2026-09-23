import Link from "next/link";
import { Headphones, ShoppingBag, Baby, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Tile {
  label: string;
  icon: LucideIcon;
  price: string;
  original: string;
  href: string;
  image: string;
}

const tiles: Tile[] = [
  {
    label: "PHONE ACCS",
    icon: Headphones,
    price: "KSh 1,099",
    original: "KSh 2,599",
    href: "/category/phones-accessories",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=70",
  },
  {
    label: "FASHION BAGS",
    icon: ShoppingBag,
    price: "KSh 630",
    original: "KSh 1,499",
    href: "/category/bags",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=70",
  },
  {
    label: "KID'S & TOY",
    icon: Baby,
    price: "KSh 950",
    original: "KSh 1,399",
    href: "/category/kids-baby",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=200&q=70",
  },
  {
    label: "PHONES",
    icon: Smartphone,
    price: "KSh 17,999",
    original: "KSh 21,999",
    href: "/category/phones-accessories",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=70",
  },
];

export function PromoTiles() {
  return (
    <section aria-label="Category promotions" className="mt-3">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative flex h-24 items-center gap-3 overflow-hidden bg-promo-gradient bg-tile-texture p-3 text-white transition-opacity hover:opacity-95"
            >
              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-xs font-bold tracking-wide">
                  <Icon className="h-4 w-4" aria-hidden />
                  {tile.label}
                </span>
                <span className="mt-2 block text-lg font-extrabold leading-none text-accent-yellow">
                  {tile.price}
                </span>
                <span className="mt-1 block text-[11px] text-white/70 line-through">
                  {tile.original}
                </span>
              </div>
              <span className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-white/10 sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
