import { useQuery } from '@tanstack/react-query';
import { getDashboardData, searchCoins } from './api';

export const useSearchCoinsQuery = (debouncedQuery: string) => {
  return useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchCoins(debouncedQuery),
    enabled: !!debouncedQuery,
    gcTime: 120000,
    retry: 1,
  });
};

export const useDashboardQuery = (timeframe: number | string = 30) => {
  return useQuery({
    queryKey: ['dashboard', timeframe],
    queryFn: () => getDashboardData(Number(timeframe)),
  });
};
