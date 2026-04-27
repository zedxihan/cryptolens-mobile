import CoinCard from '@/components/cards/CoinCard';
import { useHomeCoinsQuery } from '@/services/binance/queries';

import { ActivityIndicator, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { data, isLoading } = useHomeCoinsQuery();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-surface">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  const { popular = [] } = data || {};

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1 pt-3">
        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 12 }}
            snapToInterval={192}
            decelerationRate="fast"
            snapToAlignment="start"
            bounces={false}
          >
            {popular.map((coin) => (
              <View key={coin.id} style={{ width: 180 }}>
                <CoinCard coin={coin} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Others */}
      </ScrollView>
    </View>
  );
}
