import { CoinRow } from '@/components/cards/CoinRow';
import type { Coin } from '@/services/coingecko/types';
import { FlashList } from '@shopify/flash-list';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react-native';
import { memo, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

type ListCoin = Omit<Coin, 'market_cap'> & { market_cap?: number | null };

type SortField =
  | 'market_cap'
  | 'total_volume'
  | 'current_price'
  | 'price_change_percentage_24h';

interface Sort {
  field: SortField;
  order: 'asc' | 'desc';
}

interface CoinListProps {
  coins?: ListCoin[];
  isFetching?: boolean;
  isError?: boolean;
  onCoinPress?: (coin: ListCoin) => void;
  initialSort?: Sort;
}

const SortBtn = memo(function SortBtn({
  label,
  field,
  sort,
  onSort,
}: {
  label: string;
  field: SortField;
  sort: Sort;
  onSort: (f: SortField) => void;
}) {
  const active = sort.field === field;
  const Icon = !active
    ? ChevronsUpDown
    : sort.order === 'desc'
      ? ChevronDown
      : ChevronUp;

  return (
    <Pressable
      onPress={() => onSort(field)}
      className="flex-row items-center gap-1 py-2 active:opacity-70"
    >
      <Text
        className={`font-pmedium text-xs ${active ? 'text-text' : 'text-muted'}`}
      >
        {label}
      </Text>
      <Icon size={12} color={active ? '#D8F1E6' : '#86A79B'} />
    </Pressable>
  );
});

export function CoinList({
  coins = [],
  isFetching,
  isError,
  onCoinPress,
  initialSort = { field: 'market_cap', order: 'desc' },
}: CoinListProps) {
  const [sort, setSort] = useState<Sort>(initialSort);

  const sortedIndices = useMemo(
    () =>
      Array.from(coins.keys()).sort((a, b) => {
        const valA = Number(coins[a][sort.field] || 0);
        const valB = Number(coins[b][sort.field] || 0);
        return sort.order === 'asc' ? valA - valB : valB - valA;
      }),
    [coins, sort],
  );

  const handleSort = (field: SortField) => {
    setSort((p) => ({
      field,
      order: p.field === field && p.order === 'desc' ? 'asc' : 'desc',
    }));
  };

  const btn = (label: string, field: SortField) => (
    <SortBtn label={label} field={field} sort={sort} onSort={handleSort} />
  );

  const renderEmptyState = () => {
    if (isFetching) {
      return (
        <ActivityIndicator size="large" color="#29D18B" className="mt-20" />
      );
    }
    if (isError) {
      return (
        <Text className="font-pmedium text-price-red mt-20 text-center">
          Failed to load market data.
        </Text>
      );
    }
    return (
      <Text className="font-pmedium text-muted mt-20 text-center">
        No coins found.
      </Text>
    );
  };

  return (
    <View className="bg-bg flex-1">
      <View className="border-border-2 bg-bg z-10 flex-row justify-between border-b px-4 py-1">
        <View className="flex-row items-center gap-2">
          {btn('Market cap', 'market_cap')}
          <Text className="text-muted-2 text-xs">|</Text>
          {btn('Vol', 'total_volume')}
        </View>

        <View className="flex-row items-center gap-2">
          {btn('Last price', 'current_price')}
          <Text className="text-muted-2 text-xs">|</Text>
          {btn('Change', 'price_change_percentage_24h')}
        </View>
      </View>

      <FlashList
        data={sortedIndices}
        keyExtractor={(idx) => coins[idx].id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item: idx }) => (
          <CoinRow
            coin={coins[idx] as any}
            rank={idx + 1}
            onPress={() => onCoinPress?.(coins[idx])}
          />
        )}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}
