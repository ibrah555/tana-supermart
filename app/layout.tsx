import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { StoreLayoutWrapper } from "@/components/layout/StoreLayoutWrapper";

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
          <AdminProvider>
            <CartProvider>
              <StoreLayoutWrapper>
                <Suspense fallback={null}>{children}</Suspense>
              </StoreLayoutWrapper>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
