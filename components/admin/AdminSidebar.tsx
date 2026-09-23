"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  CreditCard,
  Store,
  Tag,
  Sliders,
  LogOut,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  Users,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { adminUser, logoutAdmin } = useAdmin();

  const navLinks = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders & Records", href: "/admin/orders", icon: Package },
    { label: "Stock & Inventory", href: "/admin/catalog", icon: ShoppingBag },
    { label: "Reports & Profit", href: "/admin/reports", icon: BarChart3 },
    { label: "User Management", href: "/admin/users", icon: Users },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "M-PESA Finance", href: "/admin/finance", icon: CreditCard },
    { label: "Vendors & Stores", href: "/admin/vendors", icon: Store },
    { label: "Vouchers & Promos", href: "/admin/promotions", icon: Tag },
    { label: "Custom Presets", href: "/admin/settings", icon: Sliders },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#24dcac] text-slate-900 border-r border-slate-300 flex flex-col justify-between min-h-screen">
      {/* Brand & Admin Profile */}
      <div>
        <div className="p-5 border-b border-slate-900/15">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded bg-slate-900 text-[#24dcac] flex items-center justify-center font-bold text-lg">
              TS
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-slate-950 leading-none">
                TANA ADMIN
              </div>
              <div className="text-[11px] font-semibold text-slate-800 uppercase tracking-wider mt-1">
                Control Center
              </div>
            </div>
          </div>
        </div>

        {/* Current Admin User Badge */}
        {adminUser && (
          <div className="mx-3 mt-4 p-3 bg-white/40 border border-slate-900/10 rounded">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-900/10">
                {adminUser.role.replace("_", " ")}
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-700" title="Online" />
            </div>
            <div className="text-xs font-bold text-slate-950 mt-1.5 truncate">
              {adminUser.name}
            </div>
            <div className="text-[11px] text-slate-800 truncate">
              {adminUser.email}
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-3 space-y-1 mt-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-950 text-white font-semibold"
                    : "text-slate-900 hover:bg-black/10 hover:text-slate-950"
                }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#24dcac]" : "text-slate-800"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Switch / Logout */}
      <div className="p-4 border-t border-slate-900/15 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-900 bg-white/50 hover:bg-white border border-slate-900/10 rounded transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <ExternalLink className="h-3.5 w-3.5" />
            Customer Storefront
          </span>
          <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">
            Live
          </span>
        </Link>

        {adminUser && (
          <button
            onClick={logoutAdmin}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-red-500/20 hover:text-red-950 border border-slate-900/10 rounded transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
