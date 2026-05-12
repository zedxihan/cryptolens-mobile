import { useMarketIndicatorsQuery } from '@/services/queries';
import { ChevronRight } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';
import { clamp } from 'react-native-reanimated';

export default function AltseasonCard() {
  const { data, isLoading } = useMarketIndicatorsQuery();
  const altSeason = data?.altSeason;
  const score = clamp(altSeason?.value ?? 0, 0, 100);

  return (
    <View className="border-border-2 bg-surface-2 min-h-[110px] flex-1 rounded-xl border p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-muted text-sm">
          AltSeason Index
        </Text>
        <ChevronRight size={18} color="#5f7d73" />
      </View>

      <View className="flex-1 justify-center pb-1">
        {isLoading || !altSeason ? (
          <ActivityIndicator color="#29d18b" />
        ) : (
          <View className="flex-1 justify-between">
            <View className="flex-row items-baseline gap-1.5">
              <Text className="font-pbold text-text text-2xl">{score}</Text>
              <Text className="font-pmedium text-muted-2 text-sm">/100</Text>
            </View>

            <View>
              <View className="mb-2 flex-row justify-between">
                <Text className="font-pmedium text-muted text-xs">Bitcoin</Text>
                <Text className="font-pmedium text-muted text-xs">Altcoin</Text>
              </View>

              <View className="relative h-2 w-full justify-center">
                <View className="absolute inset-0 flex-row overflow-hidden rounded-full">
                  <View style={{ flex: 25, backgroundColor: '#ff7c00' }} />
                  <View style={{ flex: 50, backgroundColor: '#fed7aa' }} />
                  <View style={{ flex: 25, backgroundColor: '#2463eb' }} />
                </View>

                <View
                  className="absolute items-center justify-center"
                  style={{ left: `${score}%`, marginLeft: -8 }}
                >
                  <View className="bg-text border-surface-2 size-4 rounded-full border-2" />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
