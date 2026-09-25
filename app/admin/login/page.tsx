"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, KeyRound, ArrowRight, Lock, Mail, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { defaultAdminCredentials } from "@/data/adminPresets";

export default function AdminLoginPage() {
  const router = useRouter();
  const { isAdminAuthenticated, loginAdmin } = useAdmin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isAdminAuthenticated) {
      router.replace("/admin");
    }
  }, [mounted, isAdminAuthenticated, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
          <span className="h-4 w-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
          <span>Loading admin portal...</span>
        </div>
      </div>
    );
  }

  if (isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-300 rounded p-6 max-w-sm w-full text-center">
          <CheckCircle2 className="h-8 w-8 text-[#24dcac] mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-900">Authenticated</p>
          <p className="text-xs text-slate-600 mt-1">Redirecting to Control Center...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await loginAdmin(email, password);
      if (res.success) {
        router.push("/admin");
      } else {
        setError(res.error || "Invalid administrator credentials.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail(defaultAdminCredentials.email);
    setPassword(defaultAdminCredentials.passwordHash);
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 antialiased text-slate-900">
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded bg-[#24dcac] text-slate-950 flex items-center justify-center font-bold text-sm">
            TS
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-slate-950">Tana-Supermart</span>
            <span className="text-xs text-slate-500 ml-2 font-medium">Platform Administration</span>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 px-3 py-1.5 rounded transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>Customer Storefront</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white border border-slate-300 rounded p-8">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-5 mb-6">
            <div className="h-10 w-10 bg-[#24dcac] text-slate-950 rounded flex items-center justify-center font-bold">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-950">Admin Sign In</h1>
              <p className="text-xs text-slate-600">Restricted Executive Control Center</p>
            </div>
          </div>

          {/* Seeded Default Credentials Helper Box */}
          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded text-xs">
            <div className="flex items-center justify-between font-bold text-slate-900 mb-2">
              <div className="flex items-center gap-1.5">
                <KeyRound className="h-4 w-4 text-[#24dcac]" />
                <span>Seeded Credentials:</span>
              </div>
              <span className="text-[10px] bg-[#24dcac] text-slate-950 px-1.5 py-0.5 rounded font-mono font-bold">
                SUPER_ADMIN
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono text-[11px] mb-3 bg-white p-2 border border-slate-200 rounded">
              <div>
                <span className="text-slate-500 block text-[10px]">Email:</span>
                <span className="font-semibold text-slate-900 select-all">{defaultAdminCredentials.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Password:</span>
                <span className="font-semibold text-slate-900 select-all">{defaultAdminCredentials.passwordHash}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickFill}
              className="w-full py-2 bg-[#24dcac] hover:bg-[#1ebf95] text-slate-950 font-bold text-xs rounded border border-slate-900/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>1-Click Auto Fill Demo Credentials</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tanasupermart.co.ke"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#24dcac] focus:ring-1 focus:ring-[#24dcac] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-[#24dcac] focus:ring-1 focus:ring-[#24dcac] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="inline-block h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-[#24dcac]" />
                  <span>Authenticate & Access Control Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500 font-medium">
              Authorized personnel only. All access attempts are recorded in compliance with Kenyan data laws.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto w-full text-center py-4 text-xs text-slate-500">
        Tana-Supermart Kenya • Platform Administration Console
      </div>
    </div>
  );
}
