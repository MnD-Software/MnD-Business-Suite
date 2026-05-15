/**
 * Format a number as Kenyan Shilling (KES) currency
 */
export function formatCurrency(amount: number, currency: string = "KES"): string {
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return formatted.replace("KES", "KSH");
}

/**
 * Format a number with thousand separators (for Kenyan locale)
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-KE").format(num);
}

/**
 * Parse a currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols, commas, and spaces
  const cleaned = value.replace(/[KES\s,.$]/g, "");
  return parseFloat(cleaned) || 0;
}
