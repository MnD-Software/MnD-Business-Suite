"use client";

import { useLocale, flagEmoji } from "@/lib/locale";

export function CountrySelector() {
  const { country } = useLocale();

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--c-muted))] shadow-sm">
      <span className="text-base">{flagEmoji(country.code)}</span>
      <span className="bg-transparent text-[10px] font-semibold uppercase tracking-[0.2em] text-[hsl(var(--c-muted))]">
        Kenya (KSH)
      </span>
    </div>
  );
}
