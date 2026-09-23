"use client";

import { useState } from "react";
import { Ticket, CheckCircle2, Copy } from "lucide-react";
import { initialVouchers } from "@/data/user";
import { formatKes } from "@/lib/format";

export default function VoucherCenterPage() {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  function handleClaim(id: string) {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, claimed: true } : v))
    );
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  return (
    <div className="container-app py-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-slate-900 text-white p-6 rounded-lg shadow-card flex items-center gap-3">
        <Ticket className="h-8 w-8 text-yellow-300 shrink-0" />
        <div>
          <h1 className="text-xl font-bold">Tana-Supermart Voucher Center</h1>
          <p className="text-xs text-purple-100 mt-0.5">
            Claim exclusive promo codes & shipping discounts to apply during checkout.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vouchers.map((v) => (
          <div
            key={v.id}
            className="bg-surface rounded-lg shadow-card border border-border overflow-hidden flex flex-col justify-between"
          >
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100 flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-bold text-sale tracking-wider">
                  {v.code}
                </span>
                <p className="text-xs font-bold text-foreground mt-1">{v.discountText}</p>
              </div>
              <Ticket className="h-8 w-8 text-amber-500/30" />
            </div>

            <div className="p-4 space-y-3">
              <div className="text-xs text-muted space-y-1">
                <p>• Min Spend: {formatKes(v.minSpend)}</p>
                <p>• Valid Until: {new Date(v.validUntil).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleCopy(v.code)}
                  className="btn-outline flex-1 h-8 text-xs flex items-center justify-center gap-1"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedCode === v.code ? "Copied!" : "Copy Code"}
                </button>

                <button
                  type="button"
                  onClick={() => handleClaim(v.id)}
                  disabled={v.claimed}
                  className={`btn flex-1 h-8 text-xs font-bold ${
                    v.claimed
                      ? "bg-emerald-100 text-emerald-800 cursor-default"
                      : "btn-primary"
                  }`}
                >
                  {v.claimed ? "Claimed ✓" : "Claim Voucher"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
