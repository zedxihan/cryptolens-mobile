import { connectWs, isWsConnected } from './binanceWs';
import { fetchGet } from './client';
import type {
  Coin,
  DashboardData,
  FearGreedIndex,
  FormattedEtfFlow,
  FormattedTicker,
} from './types';

// Initialize WebSocket once
if (!isWsConnected()) connectWs();

// CoinGecko
export const getDashboardData = (days = 30): Promise<DashboardData> =>
  fetchGet<DashboardData>(`api/coingecko/dashboard?days=${days}`);

export const getTop100Coins = (): Promise<Coin[]> =>
  fetchGet<Coin[]>('api/coingecko/top100');

export const searchCoins = (query: string): Promise<Coin[]> => {
  if (!query.trim()) return Promise.resolve([]);
  return fetchGet<Coin[]>(
    `api/coingecko/search?query=${encodeURIComponent(query)}`,
  );
};

// Binance
export const getTrendingCoins = (limit?: number): Promise<FormattedTicker[]> =>
  fetchGet<FormattedTicker[]>(
    `api/binance/trending${limit ? `?limit=${limit}` : ''}`,
  );

export const getTopGainers = (limit?: number): Promise<FormattedTicker[]> =>
  fetchGet<FormattedTicker[]>(
    `api/binance/gainers${limit ? `?limit=${limit}` : ''}`,
  );

export const getPopularFour = (): Promise<FormattedTicker[]> =>
  fetchGet<FormattedTicker[]>('api/binance/popular');

// Market
export const getFearGreedIndex = (): Promise<FearGreedIndex | null> =>
  fetchGet<FearGreedIndex>('api/market/fear-greed');

export const getEtfFlows = (): Promise<FormattedEtfFlow[]> =>
  fetchGet<FormattedEtfFlow[]>('api/market/etf-flows');
