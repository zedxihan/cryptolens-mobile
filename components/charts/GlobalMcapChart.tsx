import { useDashboardQuery } from '@/services/coingecko/queries';
import { formatCompact } from '@/utils/format';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import AreaChart from '@/components/ui/AreaChart';

export default function GlobalMcapChart() {
  const [timeframe, setTimeframe] = useState<string>('30');
  const { data, isLoading } = useDashboardQuery(timeframe);

  const stats = data?.global ?? null;
  const chartData = data?.chart ?? [];

  const statItems = [
    { label: 'Market Cap', value: stats?.total_mcap },
    { label: '24h Volume', value: stats?.total_volume },
  ];

  return (
    <View className="border-border-2 bg-surface-2 rounded-2xl border p-3">
      <View className="mb-3 flex-col gap-3">
        <Text className="font-psemibold text-text text-lg">
          Global Crypto Market Cap
        </Text>

        <View className="flex-row items-end justify-between">
          <View className="flex-row gap-6">
            {statItems.map((stat, index) => (
              <View key={index}>
                <Text className="font-pregular text-muted text-xs">
                  {stat.label}
                </Text>
                <Text className="font-psemibold text-text mt-1 text-xl">
                  {formatCompact(stat.value)}
                </Text>
              </View>
            ))}
          </View>

          <View className="border-border-2 bg-surface flex-row rounded-lg border p-1">
            {['7', '30', '365'].map((tf) => {
              const isActive = timeframe === tf;
              return (
                <TouchableOpacity
                  key={tf}
                  onPress={() => setTimeframe(tf)}
                  className={`rounded-md px-3 py-1.5 ${isActive ? 'border-border-2 border bg-[rgba(255,255,255,0.10)]' : ''}`}
                >
                  <Text
                    className={`font-pmedium text-xs ${isActive ? 'text-text' : 'text-muted'}`}
                  >
                    {tf === '365' ? '1y' : `${tf}d`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View className="h-[250px] w-full justify-center">
        {isLoading ? (
          <ActivityIndicator size="large" color="#29d18b" />
        ) : (
          <AreaChart data={chartData} dataKey="market_cap" />
        )}
      </View>

      <View className="border-border-2 mt-2 items-end border-t pt-2">
        <Text className="font-pregular text-muted text-xs">by CoinGecko</Text>
      </View>
    </View>
  );
}
