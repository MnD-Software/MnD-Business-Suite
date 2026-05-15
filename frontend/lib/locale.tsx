"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { backendUrl } from "@/lib/env";

export type CountryLocale = {
  code: string;
  name: string;
  locale: string;
  currency: string;
  language: string;
  continent: string;
  usdRate: number; // 1 USD -> currency
  languageCode: "en" | "fr" | "de" | "pt" | "ar" | "sw";
  dir?: "ltr" | "rtl";
};

const COUNTRIES: CountryLocale[] = [
  { code: "US", name: "United States", locale: "en-US", currency: "USD", language: "English", continent: "North America", usdRate: 1, languageCode: "en" },
  { code: "GB", name: "United Kingdom", locale: "en-GB", currency: "GBP", language: "English", continent: "Europe", usdRate: 0.79, languageCode: "en" },
  { code: "DE", name: "Germany", locale: "de-DE", currency: "EUR", language: "German", continent: "Europe", usdRate: 0.92, languageCode: "de" },
  { code: "KE", name: "Kenya", locale: "en-KE", currency: "KES", language: "English", continent: "Africa", usdRate: 145, languageCode: "en" },
  { code: "NG", name: "Nigeria", locale: "en-NG", currency: "NGN", language: "English", continent: "Africa", usdRate: 1500, languageCode: "en" },
  { code: "ZA", name: "South Africa", locale: "en-ZA", currency: "ZAR", language: "English", continent: "Africa", usdRate: 18, languageCode: "en" },
  { code: "EG", name: "Egypt", locale: "ar-EG", currency: "EGP", language: "Arabic", continent: "Africa", usdRate: 48, languageCode: "ar", dir: "rtl" },
  { code: "AE", name: "United Arab Emirates", locale: "ar-AE", currency: "AED", language: "Arabic", continent: "Asia", usdRate: 3.67, languageCode: "ar", dir: "rtl" },
  { code: "IN", name: "India", locale: "en-IN", currency: "INR", language: "English", continent: "Asia", usdRate: 83, languageCode: "en" },
  { code: "JP", name: "Japan", locale: "ja-JP", currency: "JPY", language: "Japanese", continent: "Asia", usdRate: 150, languageCode: "en" },
  { code: "BR", name: "Brazil", locale: "pt-BR", currency: "BRL", language: "Portuguese", continent: "South America", usdRate: 5.2, languageCode: "pt" }
];

type LocaleContextValue = {
  country: CountryLocale;
  countries: CountryLocale[];
  setCountryCode: (code: string) => void;
  formatCurrency: (amountUsd: number) => string;
  formatNumber: (value: number) => string;
  formatPercent: (value: number) => string;
  flag: (code?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

const STORAGE_KEY = "mnd_locale_country";
const LOCKED_COUNTRY_CODE = "KE";

export function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCode] = useState<string>(LOCKED_COUNTRY_CODE);
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) ?? COUNTRIES[0],
    [countryCode]
  );

  useEffect(() => {
    setCountryCode(LOCKED_COUNTRY_CODE);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, LOCKED_COUNTRY_CODE);
  }, [countryCode]);

  useEffect(() => {
    let active = true;

    async function loadRates() {
      try {
        const base = backendUrl();
        const res = await fetch(`${base}/api/v1/marketing/fx`);
        if (!res.ok) return;
        const data = await res.json();
        if (active) setRates(data.rates || null);
      } catch {
        // fallback to static
      }
    }

    loadRates();
    const id = window.setInterval(loadRates, 1000 * 60 * 30);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = country.locale;
    document.documentElement.dir = country.dir ?? "ltr";
  }, [country.locale, country.dir]);

  const liveRate = rates?.[country.currency];
  const effectiveRate = liveRate ?? country.usdRate;

  const value = useMemo<LocaleContextValue>(
    () => ({
      country,
      countries: COUNTRIES.filter((c) => c.code === LOCKED_COUNTRY_CODE),
      setCountryCode: () => setCountryCode(LOCKED_COUNTRY_CODE),
      formatCurrency: (amountUsd: number) => {
        const converted = amountUsd * effectiveRate;
        const formatted = new Intl.NumberFormat("en-KE", {
          style: "currency",
          currency: "KES",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(converted);
        return formatted.replace("KES", "KSH");
      },
      formatNumber: (value: number) =>
        new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value),
      formatPercent: (value: number) =>
        new Intl.NumberFormat(country.locale, { style: "percent", maximumFractionDigits: 1 }).format(value),
      flag: (code?: string) => flagEmoji(code ?? country.code)
    }),
    [country, effectiveRate]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
