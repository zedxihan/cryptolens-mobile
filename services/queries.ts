import { useQuery } from '@tanstack/react-query';
import {
  getDashboardData,
  getFearGreedIndex,
  getPopularFour,
  getTop100Coins,
  getTopGainers,
  getTrendingCoins,
  searchCoins,
} from './api';

// Home / Market Overview
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
    refetchInterval: 10000, // Reduced from 1s to 10s as per worker caching
    gcTime: 1000 * 60 * 2,
  });
};

export const useMarketTableQuery = () => {
  return useQuery({
    queryKey: ['marketTable'],
    queryFn: getTop100Coins,
    refetchInterval: 30000,
    gcTime: 1000 * 60 * 2,
  });
};

// Search
export const useSearchCoinsQuery = (debouncedQuery: string) => {
  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: !!debouncedQuery,
    gcTime: 1000 * 60 * 2,
    retry: 1,
  });
};

// Dashboard / Stats
export const useDashboardQuery = (timeframe: number | string = 30) => {
  return useQuery({
    queryKey: ['dashboard', timeframe],
    queryFn: () => getDashboardData(Number(timeframe)),
  });
};

// Fear & Greed
export const useFearGreedQuery = () => {
  return useQuery({
    queryKey: ['fearGreed'],
    queryFn: getFearGreedIndex,
    staleTime: 300000,
  });
};
