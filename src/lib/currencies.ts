export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "ILS", symbol: "₪" },
  { code: "RUB", symbol: "₽" },
] as const;

export function formatBackupPriceRange(
  min: number | null,
  max: number | null,
  currency: string | null
) {
  if (min == null && max == null) return null;
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency ?? "";

  if (min != null && max != null && min !== max) {
    return `${symbol}${min}–${symbol}${max}`;
  }

  return `${symbol}${min ?? max}`;
}
