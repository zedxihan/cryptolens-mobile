import { useTickerPrice } from '@/store/usePriceStore';
import { formatPercentage, formatPrice } from '@/utils/format';
import { memo } from 'react';
import { Text, View } from 'react-native';

interface LivePriceProps {
  symbol: string;
  currentPrice?: number;
  className?: string; // Container className
  priceClassName?: string;
  changeClassName?: string;
  showChange?: boolean;
}

export const LivePrice = memo(function LivePrice({
  symbol,
  currentPrice = 0,
  className = '',
  priceClassName = 'font-pmedium text-base',
  changeClassName = 'font-pmedium text-sm',
  showChange = false,
}: LivePriceProps) {
  const liveData = useTickerPrice(symbol);

  const price = liveData?.price ?? currentPrice;
  const change = liveData?.change ?? 0;

  return (
    <View className={className}>
      <Text
        className={`tracking-tight text-white ${priceClassName}`}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatPrice(price)}
      </Text>
      {showChange && (
        <Text
          className={`${change >= 0 ? 'text-price-green' : 'text-price-red'} ${changeClassName}`}
          numberOfLines={1}
        >
          {formatPercentage(change)}
        </Text>
      )}
    </View>
  );
});
