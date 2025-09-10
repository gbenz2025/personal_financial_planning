"use client";
import React, { useId } from "react";

export function NumberInput({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="text-sm">
      <span className="block text-neutral-700 mb-1">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        className="w-full rounded-xl border p-2"
        value={value}
        min={0}
        onChange={(e) => onChange(Number(e.target.value || 0))}
      />
    </label>
  );
}

export function RangeInput({
  label, value, onChange,
}: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="text-neutral-700">{label}</span>
        <span className="text-neutral-500">{value}%</span>
      </div>
      <input
        type="range"
        className="w-full"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export function Toggle({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex items-center justify-between text-sm">
      <span className="text-neutral-700">{label}</span>
      <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-emerald-500" : "bg-neutral-300"}`}>
        <input
          id={id}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`}
        />
      </span>
    </label>
  );
}


// export function Toggle({
//   label, checked, onChange,
// }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
//   const labelId = useId();
//   return (
//     <div className="flex items-center justify-between text-sm">
//       <span id={labelId} className="text-neutral-700">{label}</span>
//       <button
//         type="button"
//         role="switch"
//         aria-labelledby={labelId}
//         aria-checked={checked}                // React renders "true"/"false"
//         onClick={() => onChange(!checked)}
//         className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-emerald-500" : "bg-neutral-300"}`}
//       >
//         <span
//           aria-hidden="true"
//           className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${checked ? "translate-x-5" : "translate-x-1"}`}
//         />
//       </button>
//     </div>
//   );
// }
