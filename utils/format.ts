const SCALES = [
  { val: 1e12, suffix: 'T' },
  { val: 1e9, suffix: 'B' },
  { val: 1e6, suffix: 'M' },
  { val: 1e3, suffix: 'K' },
];

// price (0.00015467)
export const formatPrice = (value: any): string => {
  const num = +value;
  if (isNaN(num)) return '$0.00';

  const abs = Math.abs(num);
  const decimals = abs < 0.1 ? 5 : abs < 1 ? 4 : 2;
  const formatted = abs.toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');

  return (num < 0 ? '-$' : '$') + formatted;
};

// compact (1.2B)
export const formatCompact = (value: any): string => {
  const num = +value;
  if (isNaN(num)) return '—';

  const abs = Math.abs(num);
  const scale = SCALES.find((s) => abs >= s.val);
  if (!scale) return formatPrice(num);

  const formatted = (abs / scale.val)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+$)/g, '$&,');
  return (num < 0 ? '-$' : '$') + formatted + scale.suffix;
};

// percentage (2.45%)
export const formatPercentage = (value: any): string => {
  const num = +value;
  if (isNaN(num)) return '0.00%';
  return (num >= 0 ? '+' : '') + num.toFixed(2) + '%';
};
