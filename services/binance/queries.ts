import { useQuery } from '@tanstack/react-query';
import { getPopularFour, getTopGainers, getTrendingCoins } from './api';

export const useHomeCoinsQuery = () => {
  return useQuery({
    queryKey: ['homeCoins'],
    queryFn: async () => {
      const [trending, gainers, popular] = await Promise.all([
        getTrendingCoins(),
        getTopGainers(),
        getPopularFour(),
      ]);

      return {
        trending: trending ?? [],
        gainers: gainers ?? [],
        popular: popular ?? [],
      };
    },
    refetchInterval: 1000,
    gcTime: 1000 * 60 * 2,
  });
};
