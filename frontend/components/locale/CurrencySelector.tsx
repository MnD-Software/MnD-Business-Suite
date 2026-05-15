"use client";

import { useLocale } from "@/lib/locale";

export function CurrencySelector() {
  const { country } = useLocale();

  return (
    <div className="rounded-md bg-transparent px-2 py-1 text-xs font-semibold uppercase tracking-wider text-fg-muted">
      KSH
    </div>
  );
}
