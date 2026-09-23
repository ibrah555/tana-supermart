"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, Ticket, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "My Profile", href: "/account", icon: User },
  { label: "Orders & Tracking", href: "/account/orders", icon: Package },
  { label: "Saved Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Delivery Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Voucher Center", href: "/voucher-center", icon: Ticket },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="container-app py-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Account Navigation Sidebar */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="bg-surface p-4 shadow-card rounded-md border border-border mb-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {user.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-foreground truncate">{user.name}</h2>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>
          </div>

          <nav className="bg-surface shadow-card rounded-md border border-border overflow-hidden">
            <ul className="divide-y divide-border">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                        active
                          ? "bg-primary/10 font-semibold text-primary border-l-4 border-primary"
                          : "text-foreground hover:bg-background"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Account Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
