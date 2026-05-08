export interface DashboardData {
  global: {
    total_mcap: number;
    total_volume: number;
    mcap_change_percentage_24h: number;
  };
  dominance: {
    btc_dom: number;
    eth_dom: number;
    others_dom: number;
  };
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

export interface FearGreedIndex {
  value: number;
  label: string;
}

export interface FormattedEtfFlow {
  asset: string;
  netFlow: number;
  date: string | number;
  history: { date: string | number; value: number }[];
}


