import { Smartphone, Download, QrCode, Ticket } from "lucide-react";

export default function DownloadAppPage() {
  return (
    <div className="container-app py-8 space-y-6 max-w-4xl text-center">
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-8 rounded-xl shadow-card space-y-4">
        <Smartphone className="mx-auto h-12 w-12 text-yellow-300" />
        <h1 className="text-2xl font-bold">Download the Tana-Supermart App</h1>
        <p className="text-xs text-rose-100 max-w-md mx-auto">
          Get exclusive app-only flash sales, instant M-PESA notifications, and a KES 500 voucher on your first order!
        </p>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <a
            href="#"
            className="btn bg-black text-white hover:bg-zinc-900 px-6 h-11 text-xs font-bold flex items-center gap-2 rounded-lg"
          >
            <Download className="h-4 w-4 text-emerald-400" />
            Download for Android (Google Play)
          </a>
          <a
            href="#"
            className="btn bg-black text-white hover:bg-zinc-900 px-6 h-11 text-xs font-bold flex items-center gap-2 rounded-lg"
          >
            <Download className="h-4 w-4 text-cyan-400" />
            Download for iOS (App Store)
          </a>
        </div>
      </div>
    </div>
  );
}
