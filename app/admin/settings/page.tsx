"use client";

import { useState } from "react";
import { useAdmin } from "@/context/AdminContext";
import {
  Sliders,
  CheckCircle2,
  KeyRound,
  RotateCcw,
  Save,
  MapPin,
  Percent,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { defaultAdminCredentials } from "@/data/adminPresets";

export default function AdminSettingsPage() {
  const {
    countyRates,
    updateCountyRate,
    resetCountyRates,
    commissions,
    updateCommission,
    mpesaSettings,
    updateMpesaSettings,
  } = useAdmin();

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local state for editing M-PESA settings
  const [mpesaForm, setMpesaForm] = useState(mpesaSettings);

  const handleCopy = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1500);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 1500);
    }
  };

  const handleSaveMpesa = (e: React.FormEvent) => {
    e.preventDefault();
    updateMpesaSettings(mpesaForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Customizable Presets & System Config
          </h2>
          <p className="text-xs text-slate-500">
            Configure delivery fees across 47 Kenya counties, vendor commissions, and M-PESA parameters
          </p>
        </div>

        {saveSuccess && (
          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Preset changes saved to system memory!
          </div>
        )}
      </div>

      {/* 1. Seeded Default Credentials Card */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#24dcac]" />
            <h3 className="font-bold text-sm text-slate-900">
              Seeded Master Admin Credentials
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            Role: SUPER_ADMIN
          </span>
        </div>

        <p className="text-xs text-slate-600">
          These credentials grant full administrative authority over all modules, payments, and vendor catalogues.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Admin Email:</span>
              <span className="font-mono font-bold text-xs text-slate-900">
                {defaultAdminCredentials.email}
              </span>
            </div>
            <button
              onClick={() => handleCopy(defaultAdminCredentials.email, "email")}
              className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded text-xs flex items-center gap-1"
            >
              {copiedEmail ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span className="text-[10px]">{copiedEmail ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Master Password:</span>
              <span className="font-mono font-bold text-xs text-slate-900">
                {defaultAdminCredentials.passwordHash}
              </span>
            </div>
            <button
              onClick={() => handleCopy(defaultAdminCredentials.passwordHash, "password")}
              className="p-1.5 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded text-xs flex items-center gap-1"
            >
              {copiedPassword ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              <span className="text-[10px]">{copiedPassword ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Kenya County Shipping Rates Presets */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Kenya County Delivery Rates Presets
              </h3>
              <p className="text-xs text-slate-500">
                Adjust delivery fees per region. Applied dynamically during customer checkout.
              </p>
            </div>
          </div>
          <button
            onClick={resetCountyRates}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to Standard Presets
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-2.5 px-3">County / Zone</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Delivery SLA</th>
                <th className="py-2.5 px-3">Shipping Fee (KES)</th>
                <th className="py-2.5 px-3 text-center">Active Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {countyRates.map((rate) => (
                <tr key={rate.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {rate.county}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {rate.region}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {rate.deliveryDays}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono">KES</span>
                      <input
                        type="number"
                        value={rate.fee}
                        onChange={(e) => updateCountyRate(rate.id, { fee: Number(e.target.value) })}
                        className="w-24 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-slate-900 bg-white"
                      />
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={rate.active}
                      onChange={(e) => updateCountyRate(rate.id, { active: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Category Platform Commission Presets */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Percent className="h-4 w-4 text-indigo-600" />
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Platform Category Commission Presets
            </h3>
            <p className="text-xs text-slate-500">
              Revenue share deducted automatically from vendor sales upon order completion
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {commissions.map((comm) => (
            <div
              key={comm.id}
              className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-slate-900 block">
                  {comm.categoryName}
                </span>
                <span className="text-[10px] text-slate-500">Standard Category Take</span>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  value={comm.ratePercent}
                  onChange={(e) => updateCommission(comm.id, Number(e.target.value))}
                  className="w-16 px-2 py-1 border border-slate-300 rounded font-mono font-bold text-xs text-slate-900 bg-white text-right"
                />
                <span className="font-bold text-xs text-slate-700">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Safaricom M-PESA Daraja Configuration Presets */}
      <div className="bg-white border border-slate-200 rounded p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#24dcac]" />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Safaricom M-PESA Daraja 2.0 Gateway Presets
              </h3>
              <p className="text-xs text-slate-500">
                Manage Lipa Na M-PESA Online STK Push parameters and webhook endpoints
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
            Daraja API v2.0
          </span>
        </div>

        <form onSubmit={handleSaveMpesa} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Environment Mode
              </label>
              <select
                value={mpesaForm.environment}
                onChange={(e) => setMpesaForm({ ...mpesaForm, environment: e.target.value as "sandbox" | "production" })}
                className="w-full px-3 py-2 border border-slate-300 rounded text-slate-900 bg-white font-bold"
              >
                <option value="sandbox">Sandbox (Development / Test Shortcode)</option>
                <option value="production">Production (Live Safaricom Paybill / Till)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Business ShortCode (Paybill / Till)
              </label>
              <input
                type="text"
                value={mpesaForm.businessShortCode}
                onChange={(e) => setMpesaForm({ ...mpesaForm, businessShortCode: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Account Reference Prefix
              </label>
              <input
                type="text"
                value={mpesaForm.accountReference}
                onChange={(e) => setMpesaForm({ ...mpesaForm, accountReference: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-slate-900 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Lipa Na M-PESA Online Passkey
            </label>
            <input
              type="text"
              value={mpesaForm.passkey}
              onChange={(e) => setMpesaForm({ ...mpesaForm, passkey: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-[11px] text-slate-900 bg-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Public Callback Webhook URL
            </label>
            <input
              type="text"
              value={mpesaForm.callbackUrl}
              onChange={(e) => setMpesaForm({ ...mpesaForm, callbackUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded font-mono text-[11px] text-slate-900 bg-white"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={mpesaForm.autoSmsAlerts}
                onChange={(e) => setMpesaForm({ ...mpesaForm, autoSmsAlerts: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-0"
              />
              Send instant SMS payment receipt to customer via Africa's Talking
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 font-bold text-xs text-slate-950 bg-[#24dcac] hover:bg-[#1ebf95] rounded border border-slate-900/10 transition-colors flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              Save M-PESA Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
