"use client";

import { usePathname } from "next/navigation";
import { Search, ShieldAlert, KeyRound, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

export function AdminHeader() {
  const pathname = usePathname();
  const { mpesaSettings, adminUser, isLiveDbConnected } = useAdmin();

  const getPageTitle = () => {
    if (pathname === "/admin") return "Platform Overview & KPIs";
    if (pathname?.startsWith("/admin/orders")) return "Orders & Fulfillment Records";
    if (pathname?.startsWith("/admin/catalog")) return "Stock Control & Inventory Master";
    if (pathname?.startsWith("/admin/reports")) return "Financial & Products Performance Reports";
    if (pathname?.startsWith("/admin/users")) return "User Management & Role Assignments";
    if (pathname?.startsWith("/admin/categories")) return "Category Taxonomy Management";
    if (pathname?.startsWith("/admin/finance")) return "M-PESA Daraja Financial Ledger";
    if (pathname?.startsWith("/admin/vendors")) return "Vendors & Store Governance";
    if (pathname?.startsWith("/admin/promotions")) return "Vouchers & Flash Campaigns";
    if (pathname?.startsWith("/admin/settings")) return "Customizable Presets & Rates";
    return "Admin Control Panel";
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">
          {getPageTitle()}
        </h1>
        <div className="text-xs text-slate-500 font-medium">
          Tana Supermart Admin System • Kenya
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Neon Database Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium">
          <span className={`h-2 w-2 rounded-full ${isLiveDbConnected ? "bg-emerald-500" : "bg-blue-500 animate-pulse"}`} />
          <span>DB:</span>
          <span className="font-bold text-slate-900">
            {isLiveDbConnected ? "Neon Live" : "PostgreSQL"}
          </span>
        </div>

        {/* Daraja Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>M-PESA Daraja:</span>
          <span className="font-bold text-slate-900 uppercase">
            {mpesaSettings?.environment || "sandbox"} ({mpesaSettings?.businessShortCode || "174379"})
          </span>
        </div>

        {/* Credentials Tooltip */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-200 rounded text-xs text-slate-800">
          <KeyRound className="h-3.5 w-3.5 text-slate-600" />
          <span className="font-semibold text-slate-900">Default Auth:</span>
          <span className="font-mono text-[11px] text-slate-600">admin@tanasupermart.co.ke</span>
        </div>
      </div>
    </header>
  );
}
