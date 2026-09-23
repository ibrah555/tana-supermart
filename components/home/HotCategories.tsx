import Link from "next/link";
import {
  Headphones,
  Footprints,
  HeartPulse,
  ShoppingBag,
  Refrigerator,
  Smartphone,
  Watch,
  Home,
  Monitor,
  Laptop,
  Shirt,
  Baby,
} from "lucide-react";

const hot = [
  { name: "Earphones", slug: "phones-accessories", icon: Headphones },
  { name: "Men Shoes", slug: "shoes", icon: Footprints },
  { name: "Personal Care", slug: "health-beauty", icon: HeartPulse },
  { name: "Women Bags", slug: "bags", icon: ShoppingBag },
  { name: "Appliances", slug: "appliances", icon: Refrigerator },
  { name: "Phones", slug: "phones-accessories", icon: Smartphone },
  { name: "Smartwatches", slug: "watches-jewellery", icon: Watch },
  { name: "Home", slug: "home-kitchen", icon: Home },
  { name: "TVs", slug: "tv-audio-video", icon: Monitor },
  { name: "Laptops", slug: "computers-accessories", icon: Laptop },
  { name: "Men Clothes", slug: "clothes", icon: Shirt },
  { name: "Kids", slug: "kids-baby", icon: Baby },
];

export function HotCategories() {
  return (
    <section aria-labelledby="hot-categories-heading" className="mt-4 bg-surface py-4 shadow-card">
      <div className="container-app">
        <h2
          id="hot-categories-heading"
          className="mb-3 text-base font-bold text-foreground"
        >
          Hot Category
        </h2>
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-8">
          {hot.map(({ name, slug, icon: Icon }) => (
            <li key={name}>
              <Link
                href={`/category/${slug}`}
                className="flex flex-col items-center gap-2 py-2 text-center transition-colors"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background">
                  <Icon className="h-6 w-6 text-foreground" aria-hidden />
                </span>
                <span className="text-xs text-foreground">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
