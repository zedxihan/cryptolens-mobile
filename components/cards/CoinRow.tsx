import { FormattedTicker } from '@/services/binance/types';
import { formatCurrency } from '@/utils/format';
import { BadgeCheck } from 'lucide-react-native';
import { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { PriceChange } from '../ui/PriceChange';

interface CoinRowProps {
  coin: FormattedTicker;
  rank: number;
  onPress?: () => void;
}

const CoinRowComponent = ({ coin, rank, onPress }: CoinRowProps) => {
  const {
    image,
    symbol,
    market_cap,
    total_volume,
    current_price,
    price_change_percentage_24h,
  } = coin;

  return (
    <Pressable
      onPress={onPress}
      className="active:bg-surface-2 flex-row items-center justify-between p-4"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-6 items-center justify-center">
          <Text className="text-muted font-psemibold text-base">{rank}</Text>
        </View>

        <Image source={{ uri: image }} className="size-10 rounded-full" />

        <View className="gap-0.5">
          <View className="flex-row items-center gap-1">
            <Text className="text-text font-psemibold text-lg uppercase">
              {symbol}
            </Text>
            <BadgeCheck size={11} color="#86a79b" fill="#214428" />
          </View>

          <Text className="text-muted font-pregular text-sm">
            {formatCurrency(market_cap)} <Text className="text-muted-2">|</Text>{' '}
            {formatCurrency(total_volume)}
          </Text>
        </View>
      </View>

      <View className="mr-1 items-end gap-0.5">
        <Text className="text-text font-psemibold text-lg tracking-tight">
          {formatCurrency(current_price)}
        </Text>
        <PriceChange value={price_change_percentage_24h} className="text-sm" />
      </View>
    </Pressable>
  );
};

export const CoinRow = memo(CoinRowComponent, (prev, next) => {
  return (
    prev.rank === next.rank &&
    prev.coin.current_price === next.coin.current_price &&
    prev.coin.total_volume === next.coin.total_volume &&
    prev.coin.price_change_percentage_24h ===
      next.coin.price_change_percentage_24h
  );
});
