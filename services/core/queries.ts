import { useQuery } from '@tanstack/react-query';
import { getTop100Merged } from './marketUtils';

export const useMarketTableQuery = () => {
  return useQuery({
    queryKey: ['marketTable'],
    queryFn: getTop100Merged,
    refetchInterval: 30000,
    initialData: [],
  });
};
