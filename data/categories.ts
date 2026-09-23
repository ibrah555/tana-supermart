import {
  LayoutGrid,
  Monitor,
  Footprints,
  Smartphone,
  Home,
  HeartPulse,
  Refrigerator,
  ShoppingBag,
  Laptop,
  Shirt,
  Watch,
  Baby,
  Car,
} from "lucide-react";
import type { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "all",
    name: "All Featured",
    slug: "featured",
    icon: LayoutGrid,
    children: [
      { id: "all-new", name: "What's New", slug: "new", icon: LayoutGrid },
      { id: "all-best", name: "Best Sellers", slug: "best", icon: LayoutGrid },
    ],
  },
  {
    id: "tv-audio",
    name: "TV, Audio & Video",
    slug: "tv-audio-video",
    icon: Monitor,
    children: [
      { id: "tv", name: "Television", slug: "television", icon: Monitor },
      { id: "audio", name: "Home Audio Systems", slug: "home-audio", icon: Monitor },
      { id: "camera", name: "Camera & Photo", slug: "camera-photo", icon: Monitor },
      { id: "av-acc", name: "Accessories", slug: "av-accessories", icon: Monitor },
    ],
  },
  { id: "shoes", name: "Shoes", slug: "shoes", icon: Footprints },
  {
    id: "phones",
    name: "Phones & Accessories",
    slug: "phones-accessories",
    icon: Smartphone,
    children: [
      { id: "smartphones", name: "Smartphones", slug: "smartphones", icon: Smartphone },
      { id: "earphones", name: "Earphones", slug: "earphones", icon: Smartphone },
      { id: "chargers", name: "Chargers & Cables", slug: "chargers", icon: Smartphone },
      { id: "cases", name: "Cases & Covers", slug: "cases", icon: Smartphone },
    ],
  },
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    icon: Home,
    children: [
      { id: "cookware", name: "Cookware", slug: "cookware", icon: Home },
      { id: "furniture", name: "Furniture", slug: "furniture", icon: Home },
      { id: "bedding", name: "Bedding", slug: "bedding", icon: Home },
      { id: "kitchen-tools", name: "Kitchen Tools", slug: "kitchen-tools", icon: Home },
    ],
  },
  {
    id: "health-beauty",
    name: "Health & Beauty",
    slug: "health-beauty",
    icon: HeartPulse,
    children: [
      { id: "skincare", name: "Skincare", slug: "skincare", icon: HeartPulse },
      { id: "hair", name: "Hair Care", slug: "hair-care", icon: HeartPulse },
      { id: "fragrance", name: "Fragrance", slug: "fragrance", icon: HeartPulse },
    ],
  },
  {
    id: "appliances",
    name: "Appliances",
    slug: "appliances",
    icon: Refrigerator,
    children: [
      { id: "kitchen-app", name: "Kitchen Appliances", slug: "kitchen-appliances", icon: Refrigerator },
      { id: "home-app", name: "Home Appliances", slug: "home-appliances", icon: Refrigerator },
    ],
  },
  { id: "bags", name: "Bags", slug: "bags", icon: ShoppingBag },
  {
    id: "computers",
    name: "Computers & Accessories",
    slug: "computers-accessories",
    icon: Laptop,
    children: [
      { id: "laptops", name: "Laptops", slug: "laptops", icon: Laptop },
      { id: "desktops", name: "Desktops", slug: "desktops", icon: Laptop },
      { id: "pc-acc", name: "Accessories", slug: "pc-accessories", icon: Laptop },
    ],
  },
  { id: "clothes", name: "Clothes", slug: "clothes", icon: Shirt },
  {
    id: "watches",
    name: "Watches & Jewellery",
    slug: "watches-jewellery",
    icon: Watch,
    children: [
      { id: "men-watches", name: "Men's Watches", slug: "mens-watches", icon: Watch },
      { id: "women-watches", name: "Women's Watches", slug: "womens-watches", icon: Watch },
      { id: "jewellery", name: "Jewellery", slug: "jewellery", icon: Watch },
    ],
  },
  { id: "kids", name: "Kids & Baby Products", slug: "kids-baby", icon: Baby },
  { id: "automotive", name: "Automotive", slug: "automotive", icon: Car },
];

export const hotKeywords = [
  "Cookware X Luckydraw",
  "Washing Machine",
  "coffee table",
  "20000mAh Power Bank",
];
