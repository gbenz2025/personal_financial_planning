"use client";
import React, { useMemo, useState } from "react";
import { CardProduct, CreditBand, SpendProfile } from "@/app/lib/types";
import { CARDS } from "@/app/lib/cards";
import { netFirstYearValue } from "@/app/lib/utils";
import Panel from "@/app/components/ui/Panel";
import { NumberInput, RangeInput, Toggle } from "@/app/components/ui/Inputs";
import ResultsTable from "@/app/components/ResultsTable";

export default function CreditCardComparatorClient() {
  const [spend, setSpend] = useState<SpendProfile>({
    dining: 250, groceries: 300, gas: 80, transit: 60, travel: 100, other: 200, intlPct: 0.0,
  });
  const [userBand, setUserBand] = useState<CreditBand>("new");
  const [filters, setFilters] = useState({ noAnnualFeeOnly: true, noFxFeeOnly: false, studentEligibleOnly: false });
  const [assumptions, setAssumptions] = useState({ useRotatingCategories: false });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      CARDS.filter(c =>
        (!filters.noAnnualFeeOnly || c.annualFee === 0) &&
        (!filters.noFxFeeOnly || (c.fxFeePercent ?? 0) === 0) &&
        (!filters.studentEligibleOnly || c.studentEligible)
      ),
    [filters]
  );

  const scored = useMemo(() =>
    filtered
      .map(card => ({ card, score: netFirstYearValue({ spend, card, useRotating: assumptions.useRotatingCategories, userBand }) }))
      .sort((a, b) => b.score.net - a.score.net),
    [filtered, spend, assumptions, userBand]
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">New Grad Credit Card Comparator</h1>
          <span className="text-xs sm:text-sm text-neutral-500">Educational tool · Not financial advice</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Controls */}
        <section className="lg:col-span-1 space-y-4">
          <Panel title="Your monthly spend">
            <div className="grid grid-cols-2 gap-3">
              {([
                ["dining", "Dining"],
                ["groceries", "Groceries"],
                ["gas", "Gas"],
                ["transit", "Transit"],
                ["travel", "Travel"],
                ["other", "Other"],
              ] as const).map(([key, label]) => (
                <NumberInput
                  key={key}
                  label={`${label} ($/mo)`}
                  value={spend[key as keyof SpendProfile] as number}
                  onChange={(v) => setSpend((s) => ({ ...s, [key]: v }))}
                />
              ))}
              <div className="col-span-2">
                <RangeInput
                  label="Share of spend abroad (0–100%)"
                  value={Math.round(spend.intlPct * 100)}
                  onChange={(pct) => setSpend((s) => ({ ...s, intlPct: pct / 100 }))}
                />
              </div>
            </div>
          </Panel>

          <Panel title="Profile & filters">
            <div className="space-y-3">
              <div>
                <label htmlFor="credit-band-select" className="text-sm font-medium">Your credit situation</label>
                <select
                  id="credit-band-select"
                  className="mt-1 w-full rounded-xl border p-2"
                  value={userBand}
                  onChange={(e) => setUserBand(e.target.value as CreditBand)}
                >
                  <option value="new">New to credit / thin file</option>
                  <option value="student">Student</option>
                  <option value="fair">Fair (≈ 640–699)</option>
                  <option value="good">Good (≈ 700–749)</option>
                  <option value="excellent">Excellent (750+)</option>
                </select>
              </div>

              <Toggle
                label="Show only $0 annual fee"
                checked={filters.noAnnualFeeOnly}
                onChange={(v) => setFilters((f) => ({ ...f, noAnnualFeeOnly: v }))}
              />
              <Toggle
                label="Show only no foreign transaction fee"
                checked={filters.noFxFeeOnly}
                onChange={(v) => setFilters((f) => ({ ...f, noFxFeeOnly: v }))}
              />
              <Toggle
                label="Show only student-eligible"
                checked={filters.studentEligibleOnly}
                onChange={(v) => setFilters((f) => ({ ...f, studentEligibleOnly: v }))}
              />
            </div>
          </Panel>

          <Panel title="Assumptions">
            <Toggle
              label="I'll track/activate rotating categories when needed"
              checked={assumptions.useRotatingCategories}
              onChange={(v) => setAssumptions((a) => ({ ...a, useRotatingCategories: v }))}
            />
            <p className="text-xs text-neutral-500 mt-2">
              If off, we apply a small friction penalty to cards with rotating categories.
            </p>
          </Panel>

          <Panel title="Disclosures">
            <ul className="text-xs text-neutral-600 list-disc pl-5 space-y-2">
              <li>Illustrative terms and bonuses only. Verify with the issuer before applying.</li>
              <li>We estimate first-year value using your inputs and simple assumptions; actual value may differ.</li>
              <li>This is educational content, not financial advice. We don’t guarantee approvals or offers.</li>
            </ul>
          </Panel>
        </section>

        {/* Results */}
        <section className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-lg font-semibold">Top matches</h2>
            <span className="text-sm text-neutral-500">Sorted by estimated first-year net value</span>
          </div>

          <ResultsTable
            rows={scored}
            spend={spend}
            userBand={userBand}
            useRotating={assumptions.useRotatingCategories}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
          />
        </section>
      </main>

      <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-neutral-500">
        <p>
          © {new Date().getFullYear()} New Grad Compare · For education only. Always check the issuer’s official terms and disclosures before applying.
        </p>
      </footer>
    </div>
  );
}
