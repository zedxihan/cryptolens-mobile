import { Image } from '@/components/ui/Image';
import { useGlobalMarketQuery } from '@/services/queries';
import { ChevronRight } from 'lucide-react-native';
import { ActivityIndicator, Text, View } from 'react-native';

export default function DominanceCard() {
  const { data, isLoading } = useGlobalMarketQuery();
  const dominance = data?.dominance ?? [];

  return (
    <View className="border-border-2 bg-surface-2 flex-1 rounded-xl border p-3">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="font-psemibold text-muted text-sm">Dominance</Text>
        <ChevronRight size={18} color="#5f7d73" />
      </View>

      <View className="min-h-[64px] justify-center gap-4">
        {isLoading ? (
          <ActivityIndicator color="#29d18b" />
        ) : (
          dominance.map(({ symbol, value, image }) => (
            <View key={symbol} className="flex-row items-center gap-3">
              <Image
                source={{ uri: image }}
                className="bg-surface-1 size-7 rounded-full"
              />
              <Text className="font-psemibold text-text text-2xl">
                {value?.toFixed(2) ?? '0.00'}%
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
