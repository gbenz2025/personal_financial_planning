"use client";
import React from "react";
import { CardProduct, CreditBand, SpendProfile } from "@/app/lib/types";
import { currencyExact } from "@/app/lib/utils";

export default function Details({
  spend, card, score, userBand, useRotating,
}: {
  spend: SpendProfile;
  card: CardProduct;
  score: { net: number; rewards: number; bonus: number; af: number; fx: number; breakdown: { label: string; amount: number; rate: number }[] };
  userBand: CreditBand;
  useRotating: boolean;
}) {
  const totalMonthly = spend.dining + spend.groceries + spend.gas + spend.transit + spend.travel + spend.other;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2">
        <div className="text-sm text-neutral-700 mb-2">Breakdown by category (annual):</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {score.breakdown.map((b) => (
            <div key={b.label} className="rounded-xl border p-3 bg-neutral-50">
              <div className="text-xs uppercase tracking-wide text-neutral-500">{b.label}</div>
              <div className="font-semibold">{currencyExact(b.amount)}</div>
              <div className="text-xs text-neutral-500">@ {(b.rate * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="rounded-xl border p-3 bg-neutral-50">
          <div className="text-sm font-medium">Assumptions</div>
          <ul className="text-xs text-neutral-600 list-disc pl-4 mt-1 space-y-1">
            <li>Total monthly spend considered: {currencyExact(totalMonthly)}</li>
            <li>International spend: {(spend.intlPct * 100).toFixed(0)}%</li>
            <li>Rotating categories tracked? {useRotating ? "Yes" : "No"}</li>
            <li>Credit band: {userBand}</li>
          </ul>
        </div>
        <div className="rounded-xl border p-3 bg-neutral-50">
          <div className="text-sm font-medium">Math recap (Year 1)</div>
          <ul className="text-xs text-neutral-700 space-y-1">
            <li>Rewards: <strong>{currencyExact(score.rewards)}</strong></li>
            <li>Signup bonus: <strong>{currencyExact(score.bonus)}</strong></li>
            <li>Annual fee: −<strong>{currencyExact(score.af)}</strong></li>
            <li>FX cost: −<strong>{currencyExact(score.fx)}</strong></li>
            <li className="mt-1">→ Estimated net: <strong>{currencyExact(score.net)}</strong></li>
          </ul>
        </div>
        <div className="rounded-xl border p-3 bg-neutral-50">
          <div className="text-sm font-medium">About this card</div>
          <ul className="text-xs text-neutral-700 space-y-1">
            <li>Issuer: {card.issuer} · Network: {card.network}</li>
            <li>Complexity: {card.complexity ?? "simple"}</li>
            <li>Student-eligible: {card.studentEligible ? "Yes" : "No/Unknown"}</li>
            <li>Fits: {card.creditFit.join(", ")}</li>
            <li>As of: {card.asOf}</li>
            {card.urls?.offer && (
              <li><a href={card.urls.offer} className="text-emerald-700 hover:underline" target="_blank" rel="noreferrer">Visit issuer page ↗</a></li>
            )}
            {card.urls?.agreement && (
              <li><a href={card.urls.agreement} className="text-emerald-700 hover:underline" target="_blank" rel="noreferrer">Cardholder agreement ↗</a></li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
