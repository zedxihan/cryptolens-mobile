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
  c.header('Cache-Control', `public, max-age=${ttl}, s-maxage=${ttl}`);
  return async <T>(path: string) =>
    fetchUpstream<T>({ routeKey, path, env: c.env, customTtl: ttl });
};

// cmc
app.get('/indicators', async (c) => {
  const fetch = useStats(c, '/cmc', 10800); // 3hr

  const [fearRes, altRes] = await Promise.all([
    fetch<{
      data: { value: string | number; value_classification: string };
    }>('/v3/fear-and-greed/latest'),
    fetch<{
      data: { altcoin_index: string | number };
    }>('/v1/altcoin-season-index/latest'),
  ]);

  return c.json({
    fearGreed: fearRes.data
      ? {
          value: Number(fearRes.data.value),
          label: fearRes.data.value_classification,
        }
      : null,
    altSeason: altRes.data
      ? {
          value: Number(altRes.data.altcoin_index),
        }
      : null,
  });
});

// sosovalue
const ETF_SYMBOLS = ['btc', 'eth'];

app.get('/etf-flows', async (c) => {
  const fetch = useStats(c, '/sosovalue', 21600); // 6hr

  const data = await Promise.all(
    ETF_SYMBOLS.map(async (asset) => {
      const [res, image] = await Promise.all([
        fetch<{ data: SosoHistoryItem[]; fetchedAt?: string }>(
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
        fetchedAt: res.fetchedAt,
        history,
      };
    }),
  );

  return c.json(data);
});

export default app;
