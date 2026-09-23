import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { TopBar } from "@/components/layout/TopBar";
import { VoucherBanner } from "@/components/layout/VoucherBanner";
import { Header } from "@/components/layout/Header";
import { MainNav } from "@/components/layout/MainNav";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tana-Supermart | Affordable Online Shopping in Kenya",
  description:
    "Shop electronics, home & kitchen, fashion and more on Tana-Supermart. Fast delivery across Kenya, M-PESA payments, 7-day money back guarantee.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <TopBar />
            <VoucherBanner />
            <Header />
            <MainNav />
            <main className="flex-1">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
