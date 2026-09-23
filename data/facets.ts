export interface Facet {
  key: string;
  label: string;
  options: string[];
}

export const shippedFromLabel: Record<string, string> = {
  platform: "Fulfilled by Tana-Supermart",
  overseas: "Overseas Shipment",
  local: "Local Dispatch",
};

export const sharedFacets: Facet[] = [
  {
    key: "shippedFrom",
    label: "Shipped From",
    options: ["Fulfilled by Tana-Supermart", "Overseas Shipment", "Local Dispatch"],
  },
  {
    key: "brand",
    label: "Brand",
    options: ["AMTEC", "FEELING", "Generic", "HP", "Lyons", "Sanosan", "Tecno", "VITRON", "Xiaomi", "YooType"],
  },
  {
    key: "batteriesIncluded",
    label: "Batteries Included",
    options: ["yes", "no"],
  },
  {
    key: "displaySize",
    label: "Display Size",
    options: ["size<25 inch", "25-32 inch", "4 inches<5.5 inches", "Dolby"],
  },
];
