import type { FormattedTicker } from '@/services/types';
import { Href, useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Image } from '@/components/ui/Image';
import { LivePrice } from '@/components/ui/LivePrice';

interface KPIBoxProps {
  title: string;
  icon: string;
  coins?: FormattedTicker[];
  href: Href;
}

export default function KPIBox({ title, icon, coins = [], href }: KPIBoxProps) {
  const visibleCoins = coins.slice(0, 4);
  const router = useRouter();

  return (
    <View className="border-border-2 bg-surface-2 rounded-xl border p-3">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-psemibold text-text text-lg">
          {icon} {title}
        </Text>
        <Pressable
          onPress={() => router.push(href)}
          className="active:opacity-70"
        >
          <Text className="font-pmedium text-muted text-sm">View more →</Text>
        </Pressable>
      </View>

      <View className="flex-col gap-4">
        {visibleCoins.map(({ id, image, name, symbol, current_price }) => (
          <View key={id} className="flex-row items-center justify-between">
            <View className="flex-1 flex-row items-center gap-2 pr-2">
              <Image
                source={{ uri: image }}
                className="size-6 rounded-full"
                contentFit="cover"
                transition={200}
              />
              <Text
                className="font-pmedium text-text text-base"
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>

            <LivePrice
              symbol={symbol}
              currentPrice={current_price}
              showChange
              className="flex-row items-center gap-2"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
