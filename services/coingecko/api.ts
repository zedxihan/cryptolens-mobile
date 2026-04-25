import { fetchGet } from '../core/client';
import type {
  Coin,
  DashboardData,
  RawChartRes,
  RawCoinRes,
  RawGlobalRes,
  RawSearchRes,
} from './types';

// stats, chart, dominance
export async function getDashboardData(
  days = 30,
): Promise<DashboardData | null> {
  const [globalRes, btcChart] = await Promise.all([
    fetchGet<{ data: RawGlobalRes }>('coingecko/global'),
    fetchGet<RawChartRes>(
      `coingecko/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    ),
  ]);

  const globalData = globalRes?.data;
  const btcDom = globalData?.market_cap_percentage?.btc;
  const ethDom = globalData?.market_cap_percentage?.eth;

  if (
    !globalData?.total_market_cap?.usd ||
    btcDom == null ||
    !btcChart?.market_caps?.length
  ) {
    return null;
  }

  const domRatio = btcDom / 100;

  return {
    global: {
      total_mcap: globalData.total_market_cap.usd,
      total_volume: globalData.total_volume.usd,
      mcap_change_percentage_24h:
        globalData.market_cap_change_percentage_24h_usd,
    },
    dominance: {
      btc_dom: btcDom,
      eth_dom: ethDom,
      others_dom: 100 - btcDom - ethDom,
    },
    chart: btcChart.market_caps.map(
      ([time, btcMcap]: [number, number], i: number) => ({
        timestamp: time,
        market_cap: Math.round(btcMcap / domRatio),
        volume: Math.round((btcChart.total_volumes?.[i]?.[1] || 0) / domRatio),
      }),
    ),
  };
}

// top 100 coins
export async function getTop100Coins(): Promise<Coin[]> {
  const tickers = await fetchGet<RawCoinRes[]>(
    'coingecko/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true',
  );
  if (!Array.isArray(tickers)) return [];

  return tickers.map((c) => ({
    id: c.id,
    symbol: c.symbol.toLowerCase(),
    name: c.name,
    current_price: c.current_price,
    market_cap: c.market_cap,
    total_volume: c.total_volume,
    price_change_percentage_24h: c.price_change_percentage_24h,
    image: c.image,
    sparkline: c.sparkline_in_7d?.price || [],
  }));
}

// search coins
export async function searchCoins(query: string): Promise<Coin[]> {
  if (!query.trim()) return [];

  const res = await fetchGet<RawSearchRes>(
    `coingecko/search?query=${encodeURIComponent(query)}`,
  );
  const coins = res?.coins?.slice(0, 8);

  if (!coins?.length) return [];
  const ids = coins.map((c) => c.id).join(',');

  const fallback = await fetchGet<
    Record<string, { usd: number; usd_24h_change: number }>
  >(
    `coingecko/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  );
  return coins.map((c) => ({
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    image: c.thumb,
    current_price: fallback?.[c.id]?.usd || 0,
    price_change_percentage_24h: fallback?.[c.id]?.usd_24h_change || 0,
  }));
}

// icon fetcher
const iconCache = new Map<string, string>();
const FALLBACK_BASE = process.env.EXPO_PUBLIC_API_URL;

export async function getCoinIcon(name: string): Promise<string> {
  if (iconCache.has(name)) return iconCache.get(name)!;

  const fallbackUrl = `${FALLBACK_BASE}/avatars?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

  try {
    const res = await fetchGet<RawSearchRes>(
      `coingecko/search?query=${encodeURIComponent(name)}`,
    );
    const imageUrl = res?.coins?.[0]?.large ?? fallbackUrl;

    iconCache.set(name, imageUrl);
    return imageUrl;
  } catch {
    iconCache.set(name, fallbackUrl);
    return fallbackUrl;
  }
}
