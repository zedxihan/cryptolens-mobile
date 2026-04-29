import type { FormattedTicker } from '@/services/binance/types';
import { formatPrice } from '@/utils/format';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';
import { PriceChange } from '../ui/PriceChange';

interface KPIBoxProps {
  title: string;
  icon: string;
  coins?: FormattedTicker[];
}

export default function KPIBox({ title, icon, coins = [] }: KPIBoxProps) {
  const visibleCoins = coins.slice(0, 4);

  return (
    <View className="border-border-2 bg-surface-2 rounded-xl border p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-psemibold text-text text-lg">
          {icon} {title}
        </Text>
        <Pressable disabled className="active:opacity-70 disabled:opacity-50">
          <Text className="font-pmedium text-muted text-sm">View more →</Text>
        </Pressable>
      </View>

      <View className="flex-col gap-4">
        {visibleCoins.map(
          ({ id, image, name, current_price, price_change_percentage_24h }) => (
            <View key={id} className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center gap-2 pr-2">
                <Image
                  source={{ uri: image }}
                  style={{ width: 24, height: 24, borderRadius: 12 }}
                  contentFit="cover"
                  transition={200}
                />
                <Text
                  className="text-md font-pmedium text-text"
                  numberOfLines={1}
                >
                  {name}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Text className="text-md font-pmedium text-text">
                  {formatPrice(current_price)}
                </Text>

                <PriceChange
                  value={price_change_percentage_24h}
                  className="text-md ml-0.5"
                />
              </View>
            </View>
          ),
        )}
      </View>
    </View>
  );
}
