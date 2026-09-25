"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50 antialiased">{children}</div>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-white text-slate-900 flex antialiased">
        {/* Sidebar in solid #24dcac */}
        <AdminSidebar />

        {/* Main Workspace Area in solid white */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 bg-white min-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
