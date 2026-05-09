import { useQuery } from '@tanstack/react-query';
import {
  getDashboardData,
  getEtfFlows,
  getFearGreedIndex,
  getPopularFour,
  getTop100Coins,
  getTopGainers,
  getTrendingCoins,
  searchCoins,
} from './api';

// Market Overview
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
    refetchInterval: 10000,
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

// Global Market
export const useGlobalMarketQuery = (timeframe: number | string = 30) => {
  return useQuery({
    queryKey: ['globalMarket', timeframe],
    queryFn: () => getDashboardData(Number(timeframe)),
  });
};

// Fear & Greed
export const useFearGreedQuery = () => {
  return useQuery({
    queryKey: ['fearGreed'],
    queryFn: getFearGreedIndex,
    staleTime: 1000 * 60 * 5,
  });
};

// ETFs
export const useEtfFlowsQuery = () => {
  return useQuery({
    queryKey: ['etfFlows'],
    queryFn: getEtfFlows,
    staleTime: 1000 * 60 * 5,
  });
};
