export const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "ILS", symbol: "₪" },
  { code: "RUB", symbol: "₽" },
] as const;

export function formatBackupPrice(price: number | null, currency: string | null) {
  if (price == null) return null;
  const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? currency ?? "";
  return `${symbol}${price}`;
}
