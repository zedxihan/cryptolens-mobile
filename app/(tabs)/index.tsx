import CoinCard from '@/components/cards/CoinCard';
import KPIBox from '@/components/cards/KPIBox';
import GlobalMcapChart from '@/components/charts/GlobalMcapChart';
import { useHomeCoinsQuery } from '@/services/binance/queries';

import { ActivityIndicator, ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { data, isLoading } = useHomeCoinsQuery();

  if (isLoading) {
    return (
      <View className="bg-surface flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  const { popular = [], trending = [], gainers = [] } = data || {};

  return (
    <View className="bg-surface flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24, gap: 12, paddingTop: 12 }}
      >
        <View>
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

        <View className="px-3">
          <GlobalMcapChart />
        </View>

        <View className="flex-col gap-3 px-3">
          <KPIBox
            title="Trending"
            icon="🔥"
            coins={trending}
            href="/markets/trending"
          />
          <KPIBox
            title="Top Gainers"
            icon="🚀"
            coins={gainers}
            href="/markets/gainers"
          />
        </View>
      </ScrollView>
    </View>
  );
}
