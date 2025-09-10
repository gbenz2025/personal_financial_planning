export type RewardsCategory =
  | "dining"
  | "groceries"
  | "gas"
  | "transit"
  | "travel"
  | "other"
  | "all";

export type CreditBand = "new" | "fair" | "good" | "excellent" | "student";

export type RewardsRule = {
  category: RewardsCategory;
  rate: number;           // e.g., 0.02 = 2%
  capAnnual?: number;     // USD cap for boosted rate
  details?: string;
};

export type SignupBonus = {
  amountCash?: number;
  points?: number;
  pointValue?: number;    // default 0.01 if omitted
  spendRequirement: number;
  windowDays: number;
};

export type CardProduct = {
  id: string;
  name: string;
  issuer: string;
  network: "Visa" | "Mastercard" | "AmEx" | "Discover";
  annualFee: number;
  annualFeeFirstYear?: number;
  fxFeePercent?: number;
  baseAPRRange?: string;
  creditFit: CreditBand[];
  studentEligible?: boolean;
  rewards: RewardsRule[];
  signupBonus?: SignupBonus;
  complexity?: "simple" | "rotating" | "tiered";
  urls?: { offer?: string; agreement?: string };
  asOf: string;
};

export type SpendProfile = {
  dining: number;  // $/mo
  groceries: number;
  gas: number;
  transit: number;
  travel: number;
  other: number;
  intlPct: number; // 0..1
};
