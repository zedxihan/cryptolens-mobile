export interface RawBinanceTicker {
  symbol: string;
  lastPrice: string;
  quoteVolume: string;
  priceChangePercent: string;
}

export interface BinanceTicker {
  id: string;
  symbol: string;
  current_price: number;
  total_volume: number;
  price_change_percentage_24h: number;
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
