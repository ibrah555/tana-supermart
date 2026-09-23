import Link from "next/link";
import { Store, TrendingUp, ShieldCheck, Truck, Users, CheckCircle2 } from "lucide-react";

export default function SellerCenterPage() {
  return (
    <div className="space-y-8 py-6">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 text-white py-12 px-6 rounded-xl shadow-card">
        <div className="container-app max-w-4xl text-center space-y-4">
          <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-200">
            Tana-Supermart Marketplace
          </span>
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Sell to Millions of Shoppers Across Kenya
          </h1>
          <p className="text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Grow your business with Kenya&apos;s fastest-growing online supermarket. Fast M-PESA payouts, low commission rates, and countrywide delivery support.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link href="/seller-center/register" className="btn-primary bg-amber-500 hover:bg-amber-600 text-zinc-900 font-bold px-8 h-11 text-sm">
              Register as Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container-app grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-surface p-6 rounded-lg shadow-card border border-border space-y-3">
          <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">Instant M-PESA Payouts</h3>
          <p className="text-xs text-muted leading-relaxed">
            Receive direct payments to your M-PESA Paybill or till number immediately upon order confirmation.
          </p>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-card border border-border space-y-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Truck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">Fulfillment Support</h3>
          <p className="text-xs text-muted leading-relaxed">
            Drop off your products at any of our 45+ pickup hubs across Nairobi, Mombasa, and Kisumu.
          </p>
        </div>

        <div className="bg-surface p-6 rounded-lg shadow-card border border-border space-y-3">
          <div className="h-12 w-12 rounded-full bg-sale/10 text-sale flex items-center justify-center">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-foreground text-base">Over 500k+ Active Buyers</h3>
          <p className="text-xs text-muted leading-relaxed">
            Gain immediate exposure for your electronics, fashion, groceries, and home products.
          </p>
        </div>
      </section>
    </div>
  );
}
