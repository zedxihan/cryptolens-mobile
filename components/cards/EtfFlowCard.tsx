import { Image } from '@/components/ui/Image';
import { LivePrice } from '@/components/ui/LivePrice';
import { MiniBarChart } from '@/components/ui/MiniCharts';
import { useEtfFlowsQuery } from '@/services/queries';
import { formatCompact } from '@/utils/format';
import { FlashList } from '@shopify/flash-list';
import { ChevronRight } from 'lucide-react-native';
import { memo, useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const EtfFlowSlide = memo(function EtfFlowSlide({
  item,
  width,
}: {
  item: any;
  width: number;
}) {
  const isFlowPositive = item.netFlow >= 0;
  const dateStr = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={{ width }} className="justify-between px-1">
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: item.image }}
          className="bg-surface-1 size-7 rounded-full"
          contentFit="cover"
        />
        <LivePrice
          symbol={`${item.asset.toUpperCase()}USDT`}
          showChange
          priceClassName="text-text text-base leading-6 font-psemibold"
          changeClassName="text-xs leading-4 font-pmedium"
        />
      </View>

      <View className="mt-5 flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <Text className="font-pmedium text-muted text-xs leading-4">
            {dateStr}
          </Text>
          <Text
            className={`font-pmedium text-lg leading-6 ${isFlowPositive ? 'text-accent' : 'text-price-red'}`}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {item.netFlow === 0
              ? '$0.00'
              : `${item.netFlow > 0 ? '+' : ''}${formatCompact(item.netFlow)}`}
          </Text>
        </View>
        <MiniBarChart data={item.history} />
      </View>
    </View>
  );
});

export default function EtfFlowCard() {
  const { data, isLoading } = useEtfFlowsQuery();
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems[0]) setActiveIndex(viewableItems[0].index);
  }, []);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  return (
    <View className="border-border-2 bg-surface-2 flex-1 rounded-xl border p-3">
      <View className="mb-2 flex-row items-center justify-between px-1">
        <Text className="font-psemibold text-muted text-sm">ETF Net Flow</Text>
        <ChevronRight size={18} color="#5f7d73" />
      </View>

      <View
        className="min-h-[90px] flex-1 justify-center"
        onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
      >
        {isLoading || !Array.isArray(data) ? (
          <ActivityIndicator color="#29d18b" />
        ) : (
          <FlashList
            data={data}
            keyExtractor={(item) => item.asset}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            bounces={false}
            renderItem={({ item }) => (
              <EtfFlowSlide item={item} width={cardWidth} />
            )}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
          />
        )}
      </View>

      {Array.isArray(data) && data.length > 1 && (
        <View className="mt-2 h-2 flex-row items-center justify-center gap-1.5">
          {data.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${i === activeIndex ? 'bg-text w-3' : 'bg-muted-2 w-1.5'}`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
