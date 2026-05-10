import { CoinList } from '@/components/layout/CoinList';
import { useTopGainersQuery } from '@/services/queries';
import { View } from 'react-native';

export default function GainersScreen() {
  const { data, isFetching, isError } = useTopGainersQuery();
  const coins = data || [];

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
