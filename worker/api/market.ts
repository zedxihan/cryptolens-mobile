import { Context, Hono } from 'hono';
import { fetchUpstream, type Env } from '../fetch';
import type { SosoHistoryItem } from '../types';

const app = new Hono<{ Bindings: Env }>();

const useStats = (
  c: Context<{ Bindings: Env }>,
  routeKey: string,
  ttl: number,
) => {
  c.header('Cache-Control', `public, s-maxage=${ttl}`);
  return async <T>(path: string) =>
    fetchUpstream<T>({ routeKey, path, env: c.env, customTtl: ttl });
};

// cmc
app.get('/fear-greed', async (c) => {
  const fetch = useStats(c, '/cmc', 3600);
  const res = await fetch<{
    data?: { value: string | number; value_classification: string }[];
  }>('/v3/fear-and-greed/latest');

  const index = res?.data?.[0];
  if (!index) return c.json(null);

  return c.json({
    value: Number(index.value),
    label: index.value_classification,
  });
});

// sosovalue
const ETF_SYMBOLS = ['btc', 'eth'];

app.get('/etf-flows', async (c) => {
  const fetch = useStats(c, '/sosovalue', 3600);

  const data = await Promise.all(
    ETF_SYMBOLS.map(async (asset) => {
      const res = await fetch<SosoHistoryItem[]>(
        `/etfs/summary-history?symbol=${asset}&country_code=US`,
      );
      const raw = Array.isArray(res) ? res : [];

      const history = raw.slice(0, 7).map((h) => ({
        date: h.date || h.timestamp || '',
        value: Number(h.total_net_inflow ?? 0),
      }));

      const latest = history[0] || { value: 0, date: '' };

      return {
        asset,
        netFlow: latest.value,
        date: latest.date,
        history,
      };
    }),
  );

  return c.json(data);
});

export default app;
