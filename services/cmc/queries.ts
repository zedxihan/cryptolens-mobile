import { useQuery } from '@tanstack/react-query';
import { getFearGreedIndex } from './api';

export const useFearGreedQuery = () => {
  return useQuery({
    queryKey: ['fearGreed'],
    queryFn: getFearGreedIndex,
    staleTime: 300000,
  });
};
