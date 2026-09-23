"use client";

import { useState } from "react";
import { HelpCircle, Search, Truck, RefreshCw, Smartphone, CreditCard, ChevronDown } from "lucide-react";

const FAQS = [
  {
    category: "Payments",
    question: "How do I pay using M-PESA on Tana-Supermart?",
    answer: "Select M-PESA at checkout and click 'Place Order'. An M-PESA STK Push prompt will immediately pop up on your mobile phone. Enter your 4-digit secret PIN to confirm payment instantly.",
  },
  {
    category: "Delivery",
    question: "What are the delivery timelines across Kenya?",
    answer: "Nairobi Metro orders are delivered within 24 hours. Other major counties (Mombasa, Kisumu, Nakuru, Eldoret) take 2-3 business days. Rural & sub-counties take 3-4 days.",
  },
  {
    category: "Returns",
    question: "What is the 7-day Money Back Guarantee policy?",
    answer: "If your received item is damaged, defective, or incorrect, you can initiate a hassle-free return within 7 days of delivery for a 100% full refund.",
  },
  {
    category: "Orders",
    question: "How can I track my order status?",
    answer: "Navigate to My Account > Orders & Tracking to view live status updates (Processing, Dispatched, Out for Delivery) along with courier tracking numbers.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container-app py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-surface border border-border p-8 rounded-lg shadow-card text-center space-y-4">
        <HelpCircle className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">How can we help you today?</h1>

        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search help topics (e.g. M-PESA, delivery, returns)..."
            className="w-full h-10 pl-9 pr-3 text-xs border border-border rounded-md outline-none focus:border-primary bg-background"
          />
        </div>
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="bg-surface p-4 rounded-md border border-border text-center space-y-2">
          <Truck className="mx-auto h-6 w-6 text-primary" />
          <h3 className="text-xs font-bold text-foreground">Delivery & Shipping</h3>
          <p className="text-[11px] text-muted">Timelines by Kenya county</p>
        </div>
        <div className="bg-surface p-4 rounded-md border border-border text-center space-y-2">
          <CreditCard className="mx-auto h-6 w-6 text-emerald-600" />
          <h3 className="text-xs font-bold text-foreground">M-PESA & Payments</h3>
          <p className="text-[11px] text-muted">STK Push & Paybill help</p>
        </div>
        <div className="bg-surface p-4 rounded-md border border-border text-center space-y-2">
          <RefreshCw className="mx-auto h-6 w-6 text-sale" />
          <h3 className="text-xs font-bold text-foreground">Returns & Refunds</h3>
          <p className="text-[11px] text-muted">7-day money back policy</p>
        </div>
        <div className="bg-surface p-4 rounded-md border border-border text-center space-y-2">
          <Smartphone className="mx-auto h-6 w-6 text-indigo-600" />
          <h3 className="text-xs font-bold text-foreground">Mobile App</h3>
          <p className="text-[11px] text-muted">App setup & vouchers</p>
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="bg-surface p-6 rounded-md border border-border space-y-4">
        <h2 className="text-base font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="divide-y divide-border border-t border-border">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-foreground hover:text-primary"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-180 text-primary" : "text-muted"
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2 text-xs text-muted leading-relaxed pl-2 border-l-2 border-primary">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
