"use client";
import React from "react";

export function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-left font-medium ${className}`}>{children}</th>;
}
export function Td({ children, right = false }: { children: React.ReactNode; right?: boolean }) {
  return <td className={`px-3 py-3 align-top ${right ? "text-right" : "text-left"}`}>{children}</td>;
}
