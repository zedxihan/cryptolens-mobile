import { Context, Hono } from 'hono';
import { fetchUpstream, type Env } from '../fetch';
import type { FormattedTicker, RawTicker } from '../types';
import { resolveIcon } from './coingecko';

const app = new Hono<{ Bindings: Env }>();

// Dry hook
const useBinance = (c: Context<{ Bindings: Env }>, ttl: number) => {
  c.header('Cache-Control', `public, s-maxage=${ttl}`);
  return async <T>(path: string) =>
    fetchUpstream<T>({
      routeKey: '/binance',
      path,
      env: c.env,
      customTtl: ttl,
    });
};

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

const formatTicker = async (
  t: RawTicker,
  c: Context<{ Bindings: Env }>,
): Promise<FormattedTicker> => {
  const name = t.symbol.replace('USDT', '');
  return {
    id: t.symbol,
    symbol: name.toLowerCase(),
    name,
    current_price: +t.lastPrice,
    price_change_percentage_24h: +t.priceChangePercent,
    total_volume: +t.quoteVolume,
    market_cap: null,
    image: await resolveIcon(c, name),
  };
};

// Trending
app.get('/trending', async (c) => {
  const limit = Number(c.req.query('limit') || 25);
  const fetch = useBinance(c, 900); // 15min
  const raw = await fetch<RawTicker[]>('/ticker/24hr');
  if (!Array.isArray(raw)) return c.json([]);

  const data = await Promise.all(
    raw
      .filter((t) => validPair(t.symbol))
      .sort((a, b) => +b.quoteVolume - +a.quoteVolume)
      .slice(0, limit)
      .map((t) => formatTicker(t, c)),
  );
  return c.json(data);
});

// Top Gainers
app.get('/gainers', async (c) => {
  const limit = Number(c.req.query('limit') || 25);
  const fetch = useBinance(c, 900); // 15min
  const raw = await fetch<RawTicker[]>('/ticker/24hr');
  if (!Array.isArray(raw)) return c.json([]);

  const data = await Promise.all(
    raw
      .filter(
        (t) =>
          validPair(t.symbol) &&
          +t.quoteVolume > 1e6 &&
          +t.priceChangePercent > 0,
      )
      .sort((a, b) => +b.priceChangePercent - +a.priceChangePercent)
      .slice(0, limit)
      .map((t) => formatTicker(t, c)),
  );
  return c.json(data);
});

// Popular
const POPULAR = ['PAXGUSDT', 'XRPUSDT', 'BNBUSDT', 'SOLUSDT'];

app.get('/popular', async (c) => {
  const fetch = useBinance(c, 21600); // 6hr
  const [raw, ...klines] = await Promise.all([
    fetch<RawTicker[]>('/ticker/24hr'),
    ...POPULAR.map((s) =>
      fetch<any[][]>(`/klines?symbol=${s}&interval=1h&limit=24`),
    ),
  ]);

  if (!Array.isArray(raw)) return c.json([]);

  const tickerMap = new Map((raw as RawTicker[]).map((t) => [t.symbol, t]));

  const data = await Promise.all(
    POPULAR.map(async (symbol, i) => {
      const t = tickerMap.get(symbol);
      if (!t) return null;
      return {
        ...(await formatTicker(t, c)),
        sparkline_in_1d: { price: klines[i]?.map((k) => +k[4]) || [] },
      };
    }),
  );

  return c.json(data.filter(Boolean));
});

export default app;
