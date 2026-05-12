import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardData,
  getEtfFlows,
  getMarketIndicators,
  getPopularFour,
  getTop100Coins,
  getTopGainers,
  getTrendingCoins,
  searchCoins,
} from './api';

const MIN = 60000;

// Market Overview
export const useHomeCoinsQuery = () =>
  useQuery({
    queryKey: ['homeCoins'],
    queryFn: async () => {
      const [trending, gainers, popular] = await Promise.all([
        getTrendingCoins(4),
        getTopGainers(4),
        getPopularFour(),
      ]);
      return { trending, gainers, popular };
    },
    staleTime: 5 * MIN,
    gcTime: 10 * MIN,
  });

// Market
export const useMarketTableQuery = () =>
  useQuery({
    queryKey: ['marketTable'],
    queryFn: getTop100Coins,
    staleTime: 10 * MIN,
    gcTime: 15 * MIN,
  });

export const useTrendingCoinsQuery = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['trendingCoins'],
    queryFn: () => getTrendingCoins(),
    staleTime: 5 * MIN,
    gcTime: 10 * MIN,
    placeholderData: () =>
      queryClient.getQueryData<any>(['homeCoins'])?.trending,
  });
};

export const useTopGainersQuery = () => {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ['topGainers'],
    queryFn: () => getTopGainers(),
    staleTime: 5 * MIN,
    gcTime: 10 * MIN,
    placeholderData: () =>
      queryClient.getQueryData<any>(['homeCoins'])?.gainers,
  });
};

// Search
export const useSearchCoinsQuery = (debouncedQuery: string) =>
  useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: !!debouncedQuery,
    gcTime: 2 * MIN,
    retry: 1,
  });

// Global Market
export const useGlobalMarketQuery = (timeframe: number = 30) =>
  useQuery({
    queryKey: ['globalMarket', timeframe],
    queryFn: () => getDashboardData(timeframe),
    staleTime: 5 * MIN,
    gcTime: 10 * MIN,
  });

// Market Indicators
export const useMarketIndicatorsQuery = () =>
  useQuery({
    queryKey: ['marketIndicators'],
    queryFn: getMarketIndicators,
    staleTime: 10 * MIN,
    gcTime: 15 * MIN,
  });

// ETFs
export const useEtfFlowsQuery = () =>
  useQuery({
    queryKey: ['etfFlows'],
    queryFn: getEtfFlows,
    staleTime: 10 * MIN,
    gcTime: 15 * MIN,
  });
