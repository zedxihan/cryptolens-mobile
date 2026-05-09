import { FormattedTicker } from '@/services/types';
import { formatCompact } from '@/utils/format';
import { BadgeCheck } from 'lucide-react-native';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from '@/components/ui/Image';
import { LivePrice } from '@/components/ui/LivePrice';

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
      className="active:bg-surface-2 flex-row items-center justify-between p-3"
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

          <Text className="text-muted font-pmedium text-sm">
            {market_cap
              ? `${formatCompact(market_cap)} | ${formatCompact(total_volume)}`
              : `bVol ${formatCompact(total_volume)}`}
          </Text>
        </View>
      </View>

      <LivePrice
        symbol={symbol}
        price={current_price}
        change={price_change_percentage_24h}
        showChange
        className="items-end"
        priceClassName="font-psemibold text-base"
      />
    </Pressable>
  );
};

export const CoinRow = memo(CoinRowComponent, (prev, next) => {
  return (
    prev.rank === next.rank &&
    prev.coin.id === next.coin.id &&
    prev.coin.total_volume === next.coin.total_volume
  );
});
