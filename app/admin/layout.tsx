import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export const metadata: Metadata = {
  title: "Admin Control Center | Tana-Supermart",
  description: "Executive Management Portal for Tana-Supermart Kenya",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
