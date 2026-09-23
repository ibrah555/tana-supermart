"use client";

import { useState } from "react";
import { CheckCircle, Smartphone, Lock, X } from "lucide-react";
import { formatKes } from "@/lib/format";

interface MpesaStkModalProps {
  isOpen: boolean;
  amount: number;
  phone: string;
  onCancel: () => void;
  onSuccess: (txnId: string) => void;
}

export function MpesaStkModal({
  isOpen,
  amount,
  phone,
  onCancel,
  onSuccess,
}: MpesaStkModalProps) {
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"input" | "processing" | "success">("input");
  const [txnId, setTxnId] = useState("");

  if (!isOpen) return null;

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (pin.length < 4) return;

    setStep("processing");
    const generatedTxn = "SK" + Math.floor(10000000 + Math.random() * 90000000);
    setTxnId(generatedTxn);

    setTimeout(() => {
      setStep("success");
      setTimeout(() => {
        onSuccess(generatedTxn);
      }, 1800);
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      {/* SIM Toolkit Phone Screen Simulation */}
      <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10 text-white">
        {/* Header / Status Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-[#43A047]" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              SIM Toolkit · Safaricom M-PESA
            </span>
          </div>
          <button
            onClick={onCancel}
            type="button"
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {step === "input" && (
            <form onSubmit={handleSend} className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-[#43A047]">
                <Lock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Pay {formatKes(amount)} to Tana-Supermart
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  M-PESA prompt sent to <span className="font-mono text-zinc-200">{phone}</span>. Enter 4-digit PIN to authorize transaction:
                </p>
              </div>

              <div className="pt-2">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="• • • •"
                  autoFocus
                  className="w-36 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-center text-xl font-bold tracking-[0.5em] text-emerald-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pin.length < 4}
                  className="flex-1 rounded-lg bg-[#43A047] py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600 disabled:opacity-50"
                >
                  Send PIN
                </button>
              </div>
            </form>
          )}

          {step === "processing" && (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              <p className="text-sm font-medium text-zinc-200">
                Processing M-PESA Payment...
              </p>
              <p className="text-xs text-zinc-400">
                Connecting to Safaricom network
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="py-6 text-center space-y-3">
              <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
              <h4 className="text-base font-bold text-zinc-100">
                Payment Authorized!
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950 p-3 rounded border border-zinc-800 text-left">
                {txnId} Confirmed. KES {amount.toLocaleString()} sent to TANA SUPERMART for Order. New M-PESA balance KES 14,850.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
