"use client";

import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { VoucherBanner } from "@/components/layout/VoucherBanner";
import { Header } from "@/components/layout/Header";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";

export function StoreLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // When visiting /admin, do not render consumer store headers, navigations, or footers
    return <>{children}</>;
  }

  return (
    <>
      <TopBar />
      <VoucherBanner />
      <Header />
      <MainNav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
