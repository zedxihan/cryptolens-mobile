import { CoinList } from '@/components/layout/CoinList';
import { useHomeCoinsQuery } from '@/services/binance/queries';
import { View } from 'react-native';

export default function TrendingScreen() {
  const { data, isFetching, isError } = useHomeCoinsQuery();
  const coins = data?.trending || [];

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
