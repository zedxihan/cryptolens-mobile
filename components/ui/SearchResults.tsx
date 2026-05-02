import { useSearchCoinsQuery } from '@/services/coingecko/queries';
import type { Coin } from '@/services/coingecko/types';
import { Image } from './Image';
import { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { LivePrice } from './LivePrice';

// Debounce hook
function useDebounce<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchResults({
  query,
  onCoinPress,
}: {
  query: string;
  onCoinPress: (coin: Coin) => void;
}) {
  const { data: staticData, isLoading } = useSearchCoinsQuery(
    useDebounce(query),
  );

  if (!query.trim()) return null;

  return (
    <View className="border-border bg-surface-2/95 w-full overflow-hidden rounded-2xl border shadow-xl">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ maxHeight: 300 }}
        contentContainerStyle={{ padding: 8 }}
      >
        {isLoading ? (
          <ActivityIndicator color="#29D18B" className="my-4" />
        ) : !staticData?.length ? (
          <Text className="text-muted font-pmedium my-4 text-center text-sm">
            {`No coins found for "${query}"`}
          </Text>
        ) : (
          staticData.map((coin: Coin) => (
            <ResultItem
              key={coin.id}
              coin={coin}
              onPress={() => onCoinPress(coin)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const ResultItem = memo(function ResultItem({
  coin,
  onPress,
}: {
  coin: Coin;
  onPress: () => void;
}) {
  const { symbol, name, image, current_price } = coin;
  return (
    <Pressable
      onPress={onPress}
      className="active:bg-surface-2 flex-row items-center justify-between rounded-xl px-4 py-3"
    >
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: image }} className="size-6 rounded-full" />
        <View>
          <Text className="text-text font-psemibold text-base leading-tight uppercase">
            {symbol}
          </Text>
          <Text className="text-muted font-pmedium text-sm">{name}</Text>
        </View>
      </View>

      <LivePrice
        symbol={symbol}
        currentPrice={current_price}
        showChange
        className="items-end"
      />
    </Pressable>
  );
});
