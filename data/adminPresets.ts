// Default Admin Credentials & Customizable Presets for Tana Supermart

export interface CountyShippingRate {
  id: string;
  county: string;
  region: string;
  fee: number; // KES
  deliveryDays: string;
  active: boolean;
}

export interface CategoryCommission {
  id: string;
  categoryName: string;
  ratePercent: number;
}

export interface MpesaSettings {
  businessShortCode: string;
  accountReference: string;
  environment: "sandbox" | "production";
  consumerKey: string;
  consumerSecret: string;
  passkey: string;
  callbackUrl: string;
  autoSmsAlerts: boolean;
  minTransactionAmount: number;
  maxTransactionAmount: number;
}

export interface AdminCredential {
  email: string;
  passwordHash: string; // Plaintext for demo login Admin@2026!
  name: string;
  role: "SUPER_ADMIN" | "OPERATIONS" | "FINANCE";
  phone: string;
}

export const defaultAdminCredentials: AdminCredential = {
  email: "admin@tanasupermart.co.ke",
  passwordHash: "Admin@2026!",
  name: "Ibrahim (Master Admin)",
  role: "SUPER_ADMIN",
  phone: "+254 712 345 678",
};

export const defaultCountyShippingRates: CountyShippingRate[] = [
  { id: "1", county: "Nairobi (Central CBD)", region: "Nairobi", fee: 150, deliveryDays: "Same Day / 24h", active: true },
  { id: "2", county: "Nairobi (Suburbs & Estates)", region: "Nairobi", fee: 200, deliveryDays: "24 Hours", active: true },
  { id: "3", county: "Kiambu (Thika, Ruiru, Kikuyu)", region: "Central", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "4", county: "Machakos (Athi River, Syokimau)", region: "Eastern", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "5", county: "Kajiado (Kitengela, Ngong, Rongai)", region: "Rift Valley", fee: 250, deliveryDays: "24-48 Hours", active: true },
  { id: "6", county: "Mombasa (Island, Nyali, Bamburi)", region: "Coast", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "7", county: "Kilifi (Mtwapa, Malindi)", region: "Coast", fee: 380, deliveryDays: "2-3 Days", active: true },
  { id: "8", county: "Nakuru (City, Naivasha)", region: "Rift Valley", fee: 300, deliveryDays: "1-2 Days", active: true },
  { id: "9", county: "Uasin Gishu (Eldoret)", region: "Rift Valley", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "10", county: "Kisumu (City, Milimani)", region: "Nyanza", fee: 350, deliveryDays: "1-2 Days", active: true },
  { id: "11", county: "Kakamega", region: "Western", fee: 380, deliveryDays: "2-3 Days", active: true },
  { id: "12", county: "Nyeri & Central Highlands", region: "Central", fee: 320, deliveryDays: "1-2 Days", active: true },
  { id: "13", county: "Meru & Embu", region: "Eastern", fee: 350, deliveryDays: "2-3 Days", active: true },
  { id: "14", county: "Garissa & North Eastern", region: "North Eastern", fee: 500, deliveryDays: "3-4 Days", active: true },
  { id: "15", county: "All Other 33 Kenya Counties", region: "Nationwide", fee: 400, deliveryDays: "2-4 Days", active: true },
];

export const defaultCategoryCommissions: CategoryCommission[] = [
  { id: "1", categoryName: "Electronics & Tech", ratePercent: 6.0 },
  { id: "2", categoryName: "Smartphones & Tablets", ratePercent: 5.5 },
  { id: "3", categoryName: "Fashion, Shoes & Bags", ratePercent: 12.0 },
  { id: "4", categoryName: "Supermarket & Groceries", ratePercent: 4.5 },
  { id: "5", categoryName: "Home, Furniture & Appliances", ratePercent: 8.0 },
  { id: "6", categoryName: "Health, Beauty & Hair", ratePercent: 10.0 },
  { id: "7", categoryName: "Automotive & Accessories", ratePercent: 8.5 },
];

export const defaultMpesaSettings: MpesaSettings = {
  businessShortCode: "174379",
  accountReference: "TanaSupermart",
  environment: "sandbox",
  consumerKey: "SANDBOX_cKey_729481940x",
  consumerSecret: "SANDBOX_cSec_9921471x",
  passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  callbackUrl: "https://tanasupermart.co.ke/api/payments/mpesa/callback",
  autoSmsAlerts: true,
  minTransactionAmount: 1,
  maxTransactionAmount: 250000,
};

export interface MpesaTransactionRecord {
  id: string;
  orderId: string;
  mpesaReceiptNumber: string;
  checkoutRequestId: string;
  phone: string;
  customerName: string;
  amount: number;
  status: "COMPLETED" | "PENDING" | "FAILED" | "REVERSED";
  resultDesc: string;
  timestamp: string;
}

export const initialMpesaLedger: MpesaTransactionRecord[] = [
  {
    id: "tx-1",
    orderId: "TS-89412",
    mpesaReceiptNumber: "NL489XK2Q1",
    checkoutRequestId: "ws_CO_23092026110245192841",
    phone: "254712345678",
    customerName: "John Kamau",
    amount: 14798,
    status: "COMPLETED",
    resultDesc: "The service request is processed successfully.",
    timestamp: "2026-09-22 14:32:10",
  },
  {
    id: "tx-2",
    orderId: "TS-77291",
    mpesaReceiptNumber: "NL392BV9Z4",
    checkoutRequestId: "ws_CO_21092026094412948210",
    phone: "254722894120",
    customerName: "Faith Njeri",
    amount: 3200,
    status: "COMPLETED",
    resultDesc: "The service request is processed successfully.",
    timestamp: "2026-09-21 09:45:00",
  },
  {
    id: "tx-3",
    orderId: "TS-90124",
    mpesaReceiptNumber: "PENDING_INPUT",
    checkoutRequestId: "ws_CO_23092026114510394812",
    phone: "254701239841",
    customerName: "Brian Omondi",
    amount: 8950,
    status: "PENDING",
    resultDesc: "User STK push displayed, waiting for M-PESA PIN.",
    timestamp: "2026-09-23 11:45:10",
  },
  {
    id: "tx-4",
    orderId: "TS-66102",
    mpesaReceiptNumber: "FAILED_USER_CANCEL",
    checkoutRequestId: "ws_CO_20092026182049182390",
    phone: "254799341029",
    customerName: "Mary Wambui",
    amount: 1999,
    status: "FAILED",
    resultDesc: "Request cancelled by user [1032].",
    timestamp: "2026-09-20 18:21:15",
  },
];
