export interface DashboardData {
  global: {
    total_mcap: number;
    total_volume: number;
    mcap_change_percentage_24h: number;
  };
  dominance: Array<{
    symbol: string;
    value: number;
    image: string;
  }>;
  chart: Array<{ timestamp: number; market_cap: number; volume: number }>;
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap?: number;
  total_volume?: number;
  price_change_percentage_24h: number;
  image: string;
  sparkline?: number[];
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

export interface MarketIndicators {
  fearGreed: {
    value: number;
    label: string;
  } | null;
  altSeason: {
    value: number;
  } | null;
}

export interface FormattedEtfFlow {
  asset: string;
  image: string;
  netFlow: number;
  date: string | number;
  fetchedAt: string;
  history: { date: string | number; value: number }[];
}
