import { ShieldCheck } from "lucide-react";

export function MoneyBackStrip() {
  return (
    <div className="flex items-center gap-2 text-xs text-foreground">
      <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-sale">
        <span className="text-sm font-extrabold text-sale">7</span>
        <span className="absolute -right-1 -top-1 bg-sale px-1 text-[8px] font-bold leading-3 text-white">
          DAYS
        </span>
      </span>
      <span className="leading-tight">
        <strong className="block">7 DAYS</strong>
        Money Back Guarantee
      </span>
      <ShieldCheck className="ml-1 h-4 w-4 text-muted" aria-hidden />
    </div>
  );
}
