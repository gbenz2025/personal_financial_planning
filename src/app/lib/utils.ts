import { CardProduct, CreditBand, SignupBonus, SpendProfile, RewardsRule } from "@/app/lib/types";

export const currency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const currencyExact = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD" });

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function calcSignupBonusValue(b?: SignupBonus): number {
  if (!b) return 0;
  if (typeof b.amountCash === "number") return b.amountCash;
  if (typeof b.points === "number") return (b.pointValue ?? 0.01) * b.points;
  return 0;
}

// Annual rewards from spend + rules
export function computeAnnualRewards(spend: SpendProfile, card: CardProduct) {
  const annual = {
    dining: spend.dining * 12,
    groceries: spend.groceries * 12,
    gas: spend.gas * 12,
    transit: spend.transit * 12,
    travel: spend.travel * 12,
    other: spend.other * 12,
  };

  const base = card.rewards.find(r => r.category === "all")?.rate ?? 0;
  const cats = Object.keys(annual) as (keyof typeof annual)[];
  let total = 0;
  const breakdown: { label: string; amount: number; rate: number }[] = [];

  for (const cat of cats) {
    const spendAmt = annual[cat];
    const specificRules = card.rewards.filter(r => r.category === (cat as any));
    const bestSpecific = specificRules.reduce<RewardsRule | undefined>((best, r) => {
      if (!best || r.rate > best.rate) return r;
      return best;
    }, undefined);

    if (bestSpecific) {
      const cap = bestSpecific.capAnnual ?? Number.POSITIVE_INFINITY;
      const atBest = Math.min(spendAmt, cap);
      const remainder = Math.max(0, spendAmt - atBest);
      const earned = atBest * bestSpecific.rate + remainder * base;
      total += earned;
      breakdown.push({ label: cat, amount: earned, rate: bestSpecific.rate || base });
    } else {
      const earned = spendAmt * base;
      total += earned;
      breakdown.push({ label: cat, amount: earned, rate: base });
    }
  }

  return { total, breakdown };
}

export function fxCost(spend: SpendProfile, card: CardProduct): number {
  const monthly =
    spend.dining + spend.groceries + spend.gas + spend.transit + spend.travel + spend.other;
  const intlAnnual = monthly * 12 * clamp01(spend.intlPct);
  const rate = card.fxFeePercent ?? 0;
  return intlAnnual * rate;
}

function frictionPenalty(card: CardProduct, useRotating: boolean) {
  if (card.complexity === "rotating" && !useRotating) return 25; // heuristic
  return 0;
}
function creditFitPenalty(card: CardProduct, userBand: CreditBand) {
  return card.creditFit.includes(userBand) ? 0 : 15; // heuristic
}

export function netFirstYearValue(args: {
  spend: SpendProfile; card: CardProduct; useRotating: boolean; userBand: CreditBand;
}) {
  const { spend, card, useRotating, userBand } = args;
  const { total: rewardsTotal, breakdown } = computeAnnualRewards(spend, card);
  const bonus = calcSignupBonusValue(card.signupBonus);
  const af = card.annualFeeFirstYear ?? card.annualFee;
  const fx = fxCost(spend, card);
  const penalties = frictionPenalty(card, useRotating) + creditFitPenalty(card, userBand);
  const net = rewardsTotal + bonus - af - fx - penalties;
  return { net, rewards: rewardsTotal, bonus, af, fx, breakdown };
}
