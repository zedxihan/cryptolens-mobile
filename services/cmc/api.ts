import { fetchGet } from '../core/client';
import { FearGreedIndex, CMCFearGreedData } from './types';

export async function getFearGreedIndex(): Promise<FearGreedIndex | null> {
  const response = await fetchGet<{
    data?: CMCFearGreedData | CMCFearGreedData[];
  }>('cmc/v3/fear-and-greed/latest');
  const data = response?.data;

  if (!data) return null;

  const index = Array.isArray(data) ? data[0] : data;

  if (!index || index.value === undefined) return null;

  return {
    value: Number(index.value),
    label: index.value_classification,
  };
}
