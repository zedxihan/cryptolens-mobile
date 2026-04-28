import { useDashboardQuery } from '@/services/coingecko/queries';
import { formatCurrency } from '@/utils/format';
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
    <View className="mb-6 rounded-2xl border border-border-2 bg-surface-2 p-4">
      <View className="mb-4 flex-col gap-4">
        <Text className="font-psemibold text-lg text-text">
          Global Crypto Market Cap
        </Text>

        <View className="flex-row items-end justify-between">
          <View className="flex-row gap-6">
            {statItems.map((stat, index) => (
              <View key={index}>
                <Text className="font-pregular text-xs text-muted">
                  {stat.label}
                </Text>
                <Text className="mt-1 font-psemibold text-xl text-text">
                  {formatCurrency(stat.value)}
                </Text>
              </View>
            ))}
          </View>

          <View className="flex-row rounded-lg border border-border-2 bg-surface p-1">
            {['7', '30', '365'].map((tf) => {
              const isActive = timeframe === tf;
              return (
                <TouchableOpacity
                  key={tf}
                  onPress={() => setTimeframe(tf)}
                  className={`rounded-md px-3 py-1.5 ${isActive ? 'border border-border-2 bg-[rgba(255,255,255,0.10)]' : ''}`}
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

      <View className="h-[260px] w-full justify-center">
        {isLoading ? (
          <ActivityIndicator size="large" color="#29d18b" />
        ) : (
          <AreaChart data={chartData} dataKey="market_cap" />
        )}
      </View>

      <View className="mt-4 items-end border-t border-border-2 pt-2">
        <Text className="font-pregular text-xs text-muted">by CoinGecko</Text>
      </View>
    </View>
  );
}
