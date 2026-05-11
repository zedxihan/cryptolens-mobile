// Binance Upstream Types
export interface RawTicker {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
  priceChangePercent: string;
}

export interface FormattedTicker {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  total_volume: number;
  market_cap: number | null;
  image: string;
  sparkline_in_1d?: { price: number[] };
}

// CoinGecko Upstream Types
export interface RawGlobalRes {
  data: {
    total_market_cap: Record<string, number>;
    total_volume: Record<string, number>;
    market_cap_change_percentage_24h_usd: number;
    market_cap_percentage: Record<string, number>;
  };
}

export interface RawChartRes {
  market_caps: Array<[number, number]>;
  total_volumes: Array<[number, number]>;
}

export interface RawCoinRes {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline_in_7d?: { price: number[] };
}

export interface RawSearchRes {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    large: string;
    thumb: string;
  }>;
}

export interface RawSimplePriceRes {
  [id: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

// SosoValue ETF Types
export interface SosoHistoryItem {
  date?: string;
  timestamp?: number;
  total_net_inflow?: number;
}

export interface FormattedEtfFlow {
  asset: string;
  netFlow: number;
  date: string | number;
  fetchedAt: string;
  history: { date: string | number; value: number }[];
}

export interface FearGreedIndex {
  value: number;
  label: string;
}
