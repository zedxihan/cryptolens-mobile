import { useQuery } from '@tanstack/react-query';
import { getTop100Coins } from '../coingecko/api';

export const useMarketTableQuery = () => {
  return useQuery({
    queryKey: ['marketTable'],
    queryFn: getTop100Coins,
    refetchInterval: 30000,
    gcTime: 1000 * 60 * 2,
  });
};
