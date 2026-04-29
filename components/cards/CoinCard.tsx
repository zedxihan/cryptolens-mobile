import { FormattedTicker } from '@/services/binance/types';
import { formatPrice } from '@/utils/format';
import { Image, Text, View } from 'react-native';
import { PriceChange } from '../ui/PriceChange';
import { SparklineCell } from '../ui/Sparkline';

interface CoinCardProps {
  coin: FormattedTicker;
}

export default function CoinCard({ coin }: CoinCardProps) {
  const {
    image,
    name,
    current_price,
    price_change_percentage_24h,
    sparkline_in_1d,
  } = coin;
  const sparklineData = sparkline_in_1d?.price ?? [];
  const isPositive = price_change_percentage_24h >= 0;

  return (
    <View className="border-border-2 bg-surface-2 rounded-xl border p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1">
            <Image
              source={{ uri: image }}
              className="h-5 w-5 shrink-0 rounded-full"
            />
            <Text className="text-md font-pmedium text-text" numberOfLines={1}>
              {name}
            </Text>
          </View>

          <Text className="text-md font-pmedium text-text mt-0.5">
            {formatPrice(current_price)}
          </Text>

          <View className="flex-row items-center">
            <PriceChange
              value={price_change_percentage_24h}
              className="text-md ml-0.5"
            />
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
