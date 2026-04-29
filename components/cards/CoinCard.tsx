import { FormattedTicker } from '@/services/binance/types';
import { formatPrice } from '@/utils/format';
import { Image, Text, View } from 'react-native';
import { SparklineCell } from '../ui/Sparkline';

interface CoinCardProps {
  coin: FormattedTicker;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const change = Number(coin.price_change_percentage_24h ?? 0);
  const isPositive = change >= 0;
  const price = formatPrice(coin.current_price);
  const sparklineData = coin.sparkline_in_1d?.price ?? [];

  return (
    <View className="border-border-2 bg-surface-2 rounded-xl border p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1">
            <Image
              source={{ uri: coin.image }}
              className="h-5 w-5 shrink-0 rounded-full"
            />
            <Text className="text-md font-pmedium text-text" numberOfLines={1}>
              {coin.name}
            </Text>
          </View>

          <Text className="text-md font-pmedium text-text mt-0.5">{price}</Text>

          <View className="flex-row items-center">
            <Text
              className={`text-md font-pmedium ml-0.5 ${
                isPositive ? 'text-price-green' : 'text-price-red'
              }`}
            >
              {change > 0 ? '+' : ''}
              {change.toFixed(2)}%
            </Text>
          </View>
        </View>

        <View className="h-12 w-18 items-end justify-center">
          <SparklineCell
            data={sparklineData}
            isPositive={isPositive}
            strokeWidth={1.75}
          />
        </View>
      </View>
    </View>
  );
}
