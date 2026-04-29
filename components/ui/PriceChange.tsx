import { Text } from 'react-native';

interface PriceChangeProps {
  value?: number | null;
  className?: string;
}

export function PriceChange({
  value,
  className = '',
  ...props
}: PriceChangeProps) {
  const change = Number(value ?? 0);
  const isPositive = change >= 0;

  return (
    <Text
      className={`font-pmedium ${isPositive ? 'text-price-green' : 'text-price-red'} ${className}`}
      {...props}
    >
      {isPositive ? '+' : ''}
      {change.toFixed(2)}%
    </Text>
  );
}
