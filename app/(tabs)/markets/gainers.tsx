import { CoinList } from '@/components/layout/CoinList';
import { useHomeCoinsQuery } from '@/services/queries';
import { View } from 'react-native';

export default function GainersScreen() {
  const { data, isFetching, isError } = useHomeCoinsQuery();
  const coins = data?.gainers || [];

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
