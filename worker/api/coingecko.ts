import { Context, Hono } from 'hono';
import { fetchUpstream, ROUTES, type Env } from '../fetch';
import type {
  RawChartRes,
  RawCoinRes,
  RawGlobalRes,
  RawSearchRes,
  RawSimplePriceRes,
} from '../types';

const app = new Hono<{ Bindings: Env }>();

// DRY hook
const useCG = (c: Context<{ Bindings: Env }>, ttl: number) => {
  c.header('Cache-Control', `public, s-maxage=${ttl}`);
  return async <T>(path: string) =>
    fetchUpstream<T>({
      routeKey: '/coingecko',
      path,
      env: c.env,
      customTtl: ttl,
    });
};

// Dashboard
app.get('/dashboard', async (c) => {
  const fetch = useCG(c, 10800); // 3hr
  const days = c.req.query('days') || '30';

  const [globalRes, btcChart] = await Promise.all([
    fetch<RawGlobalRes>('/global'),
    fetch<RawChartRes>(
      `/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
    ),
  ]);

  const global = globalRes?.data;
  const btcDom = global?.market_cap_percentage?.btc;
  const ethDom = global?.market_cap_percentage?.eth;

  if (
    !global?.total_market_cap?.usd ||
    !btcDom ||
    !btcChart?.market_caps?.length
  ) {
    throw new Error('Failed to parse dashboard data');
  }

  const domRatio = btcDom / 100;

  return c.json({
    global: {
      total_mcap: global.total_market_cap.usd,
      total_volume: global.total_volume.usd,
      mcap_change_percentage_24h: global.market_cap_change_percentage_24h_usd,
    },
    dominance: {
      btc_dom: btcDom,
      eth_dom: ethDom,
      others_dom: 100 - btcDom - ethDom,
    },
    chart: btcChart.market_caps.map(([time, btcMcap], i) => ({
      timestamp: time,
      market_cap: Math.round(btcMcap / domRatio),
      volume: Math.round((btcChart.total_volumes?.[i]?.[1] || 0) / domRatio),
    })),
  });
});

// Get Top 100
app.get('/top100', async (c) => {
  const fetch = useCG(c, 21600); // 6hr
  const tickers = await fetch<RawCoinRes[]>(
    '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true',
  );

  if (!Array.isArray(tickers)) return c.json([]);

  const data = tickers.map((coin) => {
    const {
      id,
      symbol,
      name,
      current_price,
      market_cap,
      total_volume,
      price_change_percentage_24h,
      image,
      sparkline_in_7d,
    } = coin;

    return {
      id,
      symbol: symbol.toLowerCase(),
      name,
      current_price,
      market_cap,
      total_volume,
      price_change_percentage_24h,
      image,
      sparkline: sparkline_in_7d?.price || [],
    };
  });

  return c.json(data);
});

// Search Coins
app.get('/search', async (c) => {
  const fetch = useCG(c, 120);
  const query = c.req.query('query');
  if (!query || !query.trim()) return c.json([]);

  const res = await fetch<RawSearchRes>(
    `/search?query=${encodeURIComponent(query)}`,
  );
  const coins = res?.coins?.slice(0, 8);

  if (!coins?.length) return c.json([]);

  const ids = coins.map((coin) => coin.id).join(',');
  const fallback = await fetch<RawSimplePriceRes>(
    `/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  );

  const data = coins.map((coin) => {
    const { id, name, symbol, thumb } = coin;
    return {
      id,
      name,
      symbol: symbol.toLowerCase(),
      image: thumb,
      current_price: fallback?.[id]?.usd ?? 0,
      price_change_percentage_24h: fallback?.[id]?.usd_24h_change ?? 0,
    };
  });

  return c.json(data);
});

// for internal routes
export const resolveIcon = async (
  c: Context<{ Bindings: Env }>,
  name: string,
) => {
  if (!name) return '';

  const key = name.trim().toLowerCase().replace(/\s+/g, '-');
  const fallback = `${ROUTES['/avatars'].base}/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`;

  const cached = await c.env.ICONS?.get(key).catch(() => null);
  if (cached) return cached;

  const fetch = useCG(c, 86400);
  const url = await fetch<RawSearchRes>(
    `/search?query=${encodeURIComponent(name)}`,
  )
    .then((res) => res?.coins?.[0]?.large ?? fallback)
    .catch(() => fallback);

  if (c.env.ICONS) {
    c.executionCtx.waitUntil(
      c.env.ICONS.put(key, url, { expirationTtl: 86400 * 30 }).catch(() => {}),
    );
  }
  return url;
};

export default app;
