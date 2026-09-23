"use client";

import { useState, type ReactNode } from "react";
import { useAdmin } from "@/context/AdminContext";
import { ShieldCheck, KeyRound, ArrowRight } from "lucide-react";
import { defaultAdminCredentials } from "@/data/adminPresets";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAdminAuthenticated, loginAdmin } = useAdmin();
  const [email, setEmail] = useState(defaultAdminCredentials.email);
  const [password, setPassword] = useState(defaultAdminCredentials.passwordHash);
  const [error, setError] = useState("");

  if (isAdminAuthenticated) {
    return <>{children}</>;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const res = loginAdmin(email, password);
    if (!res.success) {
      setError(res.error || "Authentication failed");
    } else {
      setError("");
    }
  };

  const handleQuickLogin = () => {
    setEmail(defaultAdminCredentials.email);
    setPassword(defaultAdminCredentials.passwordHash);
    loginAdmin(defaultAdminCredentials.email, defaultAdminCredentials.passwordHash);
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
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded transition-colors text-xs"
          >
            Authenticate Admin Session
          </button>
        </form>
      </div>
    </div>
  );
}
