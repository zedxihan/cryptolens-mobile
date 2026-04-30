import { useQuery } from '@tanstack/react-query';
import { getTop100Merged } from './marketUtils';

export const useMarketTableQuery = () => {
  return useQuery({
    queryKey: ['marketTable'],
    queryFn: getTop100Merged,
    refetchInterval: 1000,
    gcTime: 1000 * 60 * 2,
  });
};
