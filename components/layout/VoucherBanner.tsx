import Link from "next/link";
import { ChevronRight, TicketPercent } from "lucide-react";

export function VoucherBanner() {
  return (
    <Link
      href="/voucher-center"
      className="group relative block overflow-hidden bg-promo-gradient bg-tile-texture"
      aria-label="Get your KSh 1,150 at the Voucher Center"
    >
      <div className="container-app flex h-8 items-center justify-center gap-2 text-white">
        <TicketPercent className="h-4 w-4" aria-hidden />
        <span className="text-xs font-medium sm:text-sm">
          Get Your{" "}
          <strong className="font-bold tracking-wide">KSh 1,150</strong> at
          Voucher Center
        </span>
        <ChevronRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </div>
    </Link>
  );
}
