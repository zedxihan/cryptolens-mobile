export const formatCurrency = (
  v: number | null | undefined,
  { compact = true } = {},
): string => {
  if (v == null || !Number.isFinite(v)) return '—';

  if (!compact) {
    return `$${v.toLocaleString()}`;
  }

  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;

  return `$${v.toLocaleString()}`;
};

export const formatPrice = (v: number | null | undefined): string => {
  if (v == null || !Number.isFinite(v)) return '$0';

  if (v >= 1) return `$${v.toFixed(2)}`;
  if (v >= 0.1) return `$${v.toFixed(4)}`;
  return `$${v.toFixed(5)}`;
};
