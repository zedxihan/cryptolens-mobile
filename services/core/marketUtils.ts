import { BinanceTicker, FormattedTicker } from '../binance/types';
import { fetchMarketData } from '../binance/api';
import { liveMarketCache } from '../binance/ws';
import { Coin } from '../coingecko/types';
import { getCoinIcon, getTop100Coins } from '../coingecko/api';

// formatter
export async function formatTicker(t: BinanceTicker): Promise<FormattedTicker> {
  const name = t.symbol.replace('USDT', '');
  return {
    id: t.symbol,
    symbol: name.toLowerCase(),
    name,
    current_price: t.current_price,
    price_change_percentage_24h: t.price_change_percentage_24h,
    total_volume: t.total_volume,
    market_cap: null,
    image: await getCoinIcon(name),
  };
}

// merge function
let geckoCache: Coin[] | null = null;
let geckoLastFetch = 0;

export async function getTop100Merged(): Promise<Coin[]> {
  const now = Date.now();

  if (!geckoCache || now - geckoLastFetch > 60000) {
    geckoCache = await getTop100Coins();
    geckoLastFetch = now;
  }

  await fetchMarketData();

  return geckoCache.map((coin) => {
    const wsData = liveMarketCache.get(`${coin.symbol.toUpperCase()}USDT`);

    return {
      ...coin,
      current_price: wsData?.current_price ?? coin.current_price,
      price_change_percentage_24h:
        wsData?.price_change_percentage_24h ?? coin.price_change_percentage_24h,
    };
  });
}
