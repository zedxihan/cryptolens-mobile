import { getCoinIcon } from '../coingecko/api';
import { fetchGet } from '../core/client';
import type { BinanceTicker, FormattedTicker, RawBinanceTicker } from './types';
import { connectWs, isWsConnected, liveMarketCache } from './ws';

const STABLECOINS = new Set([
  'USDC',
  'USDP',
  'TUSD',
  'PAX',
  'DAI',
  'EUR',
  'GBP',
  'FDUSD',
  'USD1',
]);
const validPair = (s: string) =>
  s.endsWith('USDT') && !STABLECOINS.has(s.replace('USDT', ''));

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

// core fetch & cache
let initialFetch: Promise<BinanceTicker[]> | null = null;

export async function fetchMarketData(): Promise<BinanceTicker[]> {
  if (!isWsConnected()) connectWs();

  if (liveMarketCache.size > 50) return Array.from(liveMarketCache.values());

  if (!initialFetch) {
    initialFetch = (async () => {
      try {
        const data = await fetchGet<RawBinanceTicker[]>('binance/ticker/24hr');
        if (!Array.isArray(data)) return Array.from(liveMarketCache.values());

        // prettier-ignore
        for (const { symbol, lastPrice, quoteVolume, priceChangePercent } of data) {
          if (!liveMarketCache.has(symbol)) continue;

          liveMarketCache.set(symbol, {
            id: symbol,
            symbol,
            current_price: +lastPrice,
            total_volume: +quoteVolume,
            price_change_percentage_24h: +priceChangePercent,
          });
        }
      } catch (err) {
        console.error('Binance REST sync failed:', err);
      } finally {
        initialFetch = null;
      }
      return Array.from(liveMarketCache.values());
    })();
  }
  return initialFetch;
}

// generic list
async function getList(
  filterFn: (t: BinanceTicker) => boolean,
  sortFn: (a: BinanceTicker, b: BinanceTicker) => number,
  limit: number = 4,
) {
  const filtered = (await fetchMarketData())
    .filter(filterFn)
    .sort(sortFn)
    .slice(0, limit);
  return Promise.all(filtered.map(formatTicker));
}

// popular coins
export async function getPopularFour() {
  const POPULAR = ['PAXGUSDT', 'BNBUSDT', 'AVAXUSDT', 'SUIUSDT'];

  const tickers = await getList(
    (t) => POPULAR.includes(t.symbol),
    (a, b) => POPULAR.indexOf(a.symbol) - POPULAR.indexOf(b.symbol),
    4,
  );
  const klines = await Promise.all(
    POPULAR.map((c) =>
      fetchGet<any[]>(`binance/klines?symbol=${c}&interval=1h&limit=24`),
    ),
  );
  return tickers.map((t, i) => ({
    ...t,
    sparkline_in_1d: { price: klines[i].map((k) => +k[4]) }, // k[4] is close price
  }));
}

// trending coins
export const getTrendingCoins = () =>
  getList(
    (t) => validPair(t.symbol),
    (a, b) => b.total_volume - a.total_volume,
  );

// top gainers
export const getTopGainers = () =>
  getList(
    (t) =>
      validPair(t.symbol) &&
      t.total_volume > 1e6 &&
      t.price_change_percentage_24h > 0,
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  );
