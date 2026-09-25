"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useAdmin } from "@/context/AdminContext";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { defaultAdminCredentials } from "@/data/adminPresets";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAdminAuthenticated, loginAdmin } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState(defaultAdminCredentials.email);
  const [password, setPassword] = useState(defaultAdminCredentials.passwordHash);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
          <span className="h-4 w-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
          <span>Verifying admin session...</span>
        </div>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed");
      } else {
        setError("");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setEmail(defaultAdminCredentials.email);
    setPassword(defaultAdminCredentials.passwordHash);
    setLoading(true);
    try {
      await loginAdmin(defaultAdminCredentials.email, defaultAdminCredentials.passwordHash);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-300 rounded p-8">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-5 mb-6">
          <div className="h-10 w-10 bg-[#24dcac] text-slate-900 rounded flex items-center justify-center font-bold">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Tana Admin Portal</h2>
            <p className="text-xs text-slate-600">Restricted Executive Access</p>
          </div>
        </div>

        {/* Seeded Credentials Banner */}
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1.5">
            <KeyRound className="h-3.5 w-3.5 text-[#24dcac]" />
            Seeded Default Credentials:
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono text-[11px] mb-3">
            <div>
              <span className="text-slate-500 block">Email:</span>
              <span className="font-semibold text-slate-900">{defaultAdminCredentials.email}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Password:</span>
              <span className="font-semibold text-slate-900">{defaultAdminCredentials.passwordHash}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickLogin}
            className="w-full py-2 bg-[#24dcac] hover:bg-[#1ebf95] text-slate-950 font-bold text-xs rounded border border-slate-900/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>1-Click Auto Fill & Log In</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Admin Email
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Master Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white focus:outline-none focus:border-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded transition-colors text-xs flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <span>Authenticate Admin Session</span>
            )}
          </button>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600">
            <Link href="/admin/login" className="hover:text-slate-900 underline font-medium">
              Dedicated Login Page ›
            </Link>
            <Link href="/" className="hover:text-slate-900 underline font-medium">
              Return to Storefront
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
