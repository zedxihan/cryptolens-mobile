// raw data
export interface RawGlobalRes {
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_change_percentage_24h_usd: number;
  market_cap_percentage: { btc: number; eth: number };
}

export interface RawChartRes {
  market_caps: [number, number][]; // [timestamp, value]
  total_volumes: [number, number][];
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
    thumb: string;
    large: string;
  }>;
}

// cleaned data
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
