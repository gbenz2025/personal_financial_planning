"use client";
import React from "react";
import { CardProduct, CreditBand, SpendProfile } from "@/app/lib/types";
import { currency } from "@/app/lib/utils";
import { Th, Td } from "@/app/components/ui/Table";
import Details from "@/app/components/Details";

export default function ResultsTable({
  rows, spend, userBand, useRotating, expandedId, setExpandedId,
}: {
  rows: { card: CardProduct; score: { net: number; rewards: number; bonus: number; af: number; fx: number; breakdown: any[] } }[];
  spend: SpendProfile;
  userBand: CreditBand;
  useRotating: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <Th>Card</Th>
            <Th className="text-right">Est. 1st-year value</Th>
            <Th className="text-right">Rewards/yr</Th>
            <Th className="text-right">Bonus</Th>
            <Th className="text-right">Annual fee</Th>
            <Th className="text-right">FX fee</Th>
            <Th>Notes</Th>
            <Th>&nbsp;</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ card, score }) => (
            <React.Fragment key={card.id}>
              <tr className="border-t hover:bg-neutral-50">
                <Td>
                  <div className="font-medium">{card.name}</div>
                  <div className="text-xs text-neutral-500">
                    {card.issuer} · {card.network} · Verified {card.asOf}
                  </div>
                </Td>
                <Td right>
                  <div className="font-semibold">{currency(score.net)}</div>
                  <div className="text-[11px] text-neutral-500">after AF/FX & penalties</div>
                </Td>
                <Td right>{currency(score.rewards)}</Td>
                <Td right>{currency(score.bonus)}</Td>
                <Td right>{(card.annualFeeFirstYear ?? card.annualFee) ? currency(card.annualFeeFirstYear ?? card.annualFee) : "$0"}</Td>
                <Td right>{card.fxFeePercent ? `${Math.round((card.fxFeePercent ?? 0) * 100)}%` : "0%"}</Td>
                <Td>
                  <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px]">
                    {card.complexity ?? "simple"}
                  </span>
                  {card.studentEligible && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px]">
                      student-eligible
                    </span>
                  )}
                </Td>
                <Td>
                  <button
                    onClick={() => setExpandedId(expandedId === card.id ? null : card.id)}
                    className="text-xs rounded-lg border px-3 py-1 hover:bg-neutral-50"
                  >
                    {expandedId === card.id ? "Hide math" : "Why this?"}
                  </button>
                </Td>
              </tr>
              {expandedId === card.id && (
                <tr className="bg-white">
                  <td colSpan={8} className="p-4">
                    <Details
                      spend={spend}
                      card={card}
                      score={score}
                      userBand={userBand}
                      useRotating={useRotating}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
