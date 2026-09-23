import { ShoppingBag, ShieldCheck, Truck, Award } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container-app py-8 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">About Tana-Supermart</h1>
        <p className="text-xs text-muted">Kenya&apos;s Preferred Online Supermarket & Marketplace</p>
      </div>

      <div className="bg-surface p-6 rounded-lg shadow-card border border-border space-y-4 text-xs leading-relaxed text-muted">
        <p>
          Founded with a mission to make everyday shopping affordable and accessible for every household in Kenya, <strong className="text-foreground">Tana-Supermart</strong> provides a seamless online platform connecting consumers with top-quality electronics, home & kitchen appliances, fashion, and daily essentials.
        </p>
        <p>
          With seamless M-PESA integration, fast door-to-door delivery across all 47 counties, and a strict 7-day money-back guarantee, we empower thousands of local Kenyan sellers while ensuring peace of mind for buyers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-surface p-4 rounded border border-border text-center space-y-2">
          <Truck className="mx-auto h-6 w-6 text-primary" />
          <h3 className="text-xs font-bold text-foreground">47 Counties Delivery</h3>
          <p className="text-[11px] text-muted">Nationwide logistics coverage</p>
        </div>
        <div className="bg-surface p-4 rounded border border-border text-center space-y-2">
          <ShieldCheck className="mx-auto h-6 w-6 text-emerald-600" />
          <h3 className="text-xs font-bold text-foreground">100% Safe Payments</h3>
          <p className="text-[11px] text-muted">M-PESA STK Push authorization</p>
        </div>
        <div className="bg-surface p-4 rounded border border-border text-center space-y-2">
          <Award className="mx-auto h-6 w-6 text-sale" />
          <h3 className="text-xs font-bold text-foreground">7-Day Guarantee</h3>
          <p className="text-[11px] text-muted">Hassle-free return policy</p>
        </div>
      </div>
    </div>
  );
}
