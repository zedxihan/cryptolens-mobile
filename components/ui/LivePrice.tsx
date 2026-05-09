import { useTickerPrice } from '@/store/usePriceStore';
import { formatPercentage, formatPrice } from '@/utils/format';
import { memo } from 'react';
import { Text, View } from 'react-native';

interface LivePriceProps {
  symbol: string;
  price?: number;
  change?: number;
  className?: string; // Container className
  priceClassName?: string;
  changeClassName?: string;
  showChange?: boolean;
}

export const LivePrice = memo(function LivePrice({
  symbol,
  price: initialPrice = 0,
  change: initialChange = 0,
  className = '',
  priceClassName = 'font-pmedium text-base',
  changeClassName = 'font-pmedium text-sm',
  showChange = false,
}: LivePriceProps) {
  const liveData = useTickerPrice(symbol);

  const currentPrice = liveData?.price ?? initialPrice;
  const currentChange = liveData?.change ?? initialChange;

  return (
    <View className={className}>
      <Text
        className={`tracking-tight text-white ${priceClassName}`}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatPrice(currentPrice)}
      </Text>
      {showChange && (
        <Text
          className={`${currentChange >= 0 ? 'text-price-green' : 'text-price-red'} ${changeClassName}`}
          numberOfLines={1}
        >
          {formatPercentage(currentChange)}
        </Text>
      )}
    </View>
  );
});
