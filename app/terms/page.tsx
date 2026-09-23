export default function TermsPage() {
  return (
    <div className="container-app py-8 max-w-4xl space-y-4 text-xs leading-relaxed text-muted">
      <h1 className="text-xl font-bold text-foreground">Terms & Conditions</h1>
      <div className="bg-surface p-6 rounded border border-border space-y-3">
        <h2 className="font-bold text-foreground">1. Introduction</h2>
        <p>Welcome to Tana-Supermart. By accessing or using our platform, you agree to comply with these terms of service.</p>

        <h2 className="font-bold text-foreground">2. M-PESA & Payments</h2>
        <p>All prices listed on Tana-Supermart are in Kenyan Shillings (KES). Payments are processed securely via Safaricom M-PESA.</p>

        <h2 className="font-bold text-foreground">3. Returns & Refunds</h2>
        <p>Customers are entitled to a return request within 7 days of receiving products if defective or incorrect.</p>
      </div>
    </div>
  );
}
