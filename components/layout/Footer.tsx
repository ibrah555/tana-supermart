"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Smartphone } from "lucide-react";
import { Logo } from "./Logo";

const LINK_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "About Tana-Supermart",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Voucher Center", href: "/voucher-center" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "How to Shop", href: "/help/how-to-shop" },
      { label: "Delivery Information", href: "/help/delivery" },
      { label: "Returns & Refunds", href: "/help/returns" },
      { label: "Report a Product", href: "/help/report" },
    ],
  },
  {
    title: "Make Money With Us",
    links: [
      { label: "Sell on Tana-Supermart", href: "/seller-center" },
      { label: "Become a Supplier", href: "/suppliers" },
      { label: "Affiliate Program", href: "/affiliates" },
      { label: "Advertise With Us", href: "/advertise" },
    ],
  },
];

const PAYMENT_BADGES = ["M-PESA", "VISA", "Mastercard", "Airtel Money"];

export function Footer() {
  return (
    <footer className="mt-8 bg-[#2B2B2B] text-white/80">
      <div className="container-app grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-6">
            Kenya&apos;s affordable online supermarket. Electronics, home &
            kitchen, fashion and more — delivered countrywide with M-PESA
            payments and a 7-day money back guarantee.
          </p>
          <div className="mt-4 flex gap-3">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Youtube, label: "YouTube" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href={`https://${label.toLowerCase()}.com/tanasupermart`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {LINK_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="mb-3 text-sm font-bold text-white">{col.title}</h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <form
            className="flex w-full max-w-sm"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Subscribe to our newsletter"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
                aria-hidden
              />
              <input
                id="newsletter-email"
                type="email"
                required
                placeholder="Subscribe to our newsletter"
                className="h-10 w-full bg-white/10 pl-9 pr-3 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="h-10 bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              Subscribe
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" aria-hidden />
            <span className="text-xs">Download our app</span>
            <a
              href="/download-app"
              className="border border-white/30 px-2.5 py-1 text-[10px] font-semibold transition-colors hover:border-primary"
            >
              Google Play
            </a>
            <a
              href="/download-app"
              className="border border-white/30 px-2.5 py-1 text-[10px] font-semibold transition-colors hover:border-primary"
            >
              App Store
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-3 py-4 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Tana-Supermart. All rights reserved.</p>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods">
            {PAYMENT_BADGES.map((p) => (
              <span
                key={p}
                className="border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/70"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
