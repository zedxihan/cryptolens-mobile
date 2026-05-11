import { Context, Hono } from 'hono';
import { fetchUpstream, type Env } from '../fetch';
import type { SosoHistoryItem } from '../types';
import { resolveIcon } from './coingecko';

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
  const fetch = useStats(c, '/cmc', 10800); // 3hr
  const res = await fetch<{
    data: { value: string | number; value_classification: string };
  }>('/v3/fear-and-greed/latest');

  const index = res.data;
  if (!index) return c.json(null);

  return c.json({
    value: Number(index.value),
    label: index.value_classification,
  });
});

// sosovalue
const ETF_SYMBOLS = ['btc', 'eth'];

app.get('/etf-flows', async (c) => {
  const fetch = useStats(c, '/sosovalue', 21600); // 6hr

  const data = await Promise.all(
    ETF_SYMBOLS.map(async (asset) => {
      const [res, image] = await Promise.all([
        fetch<{ data: SosoHistoryItem[] }>(
          `/etfs/summary-history?symbol=${asset}&country_code=US`,
        ),
        resolveIcon(c, asset),
      ]);

      const history = res.data
        .filter((h, i, self) => !i || h.date !== self[i - 1].date)
        .slice(0, 5)
        .map((h) => ({
          date: h.date ?? h.timestamp ?? '',
          value: Number(h.total_net_inflow ?? 0),
        }));

      const latest = history[0] ?? { value: 0, date: '' };

      return {
        asset,
        image,
        netFlow: latest.value,
        date: latest.date,
        fetchedAt: new Date().toISOString(),
        history,
      };
    }),
  );

  return c.json(data);
});

export default app;
