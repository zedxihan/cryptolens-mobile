import { CoinList } from '@/components/layout/CoinList';
import { useMarketTableQuery } from '@/services/core/queries';
import { View } from 'react-native';

export default function Top100Screen() {
  const { data: coins, isFetching, isError } = useMarketTableQuery();

  return (
    <View className="bg-bg flex-1 px-1">
      <CoinList
        coins={coins}
        isFetching={isFetching}
        isError={isError}
        onCoinPress={(coin) => {
          console.log(coin.symbol);
        }}
      />
    </View>
  );
}
