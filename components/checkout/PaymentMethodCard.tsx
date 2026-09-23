"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaymentMethodCard() {
  const [selected, setSelected] = useState(true);

  return (
    <section aria-labelledby="payment-heading" className="bg-surface shadow-card">
      <header className="border-b border-border px-4 py-3">
        <h2 id="payment-heading" className="text-sm font-bold text-foreground">
          Payment Method
          <span className="ml-2 text-xs font-normal text-muted">
            (Trusted Payment, 100% Money Back Guarantee)
          </span>
        </h2>
      </header>

      <div className="p-4">
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => setSelected(true)}
          className={cn(
            "flex w-full items-center justify-between border px-4 py-3 text-left transition-colors",
            selected ? "border-sale" : "border-border hover:border-primary"
          )}
        >
          <span className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-tight text-[#43A047]">
              M<span className="text-foreground">-PESA</span>
            </span>
            <span className="text-xs text-muted">
              Cards, M-PESA, Bank Transfer or Mobile Money
            </span>
          </span>
          <CheckCircle2
            className={cn("h-5 w-5", selected ? "text-sale" : "text-border")}
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
